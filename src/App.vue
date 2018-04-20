<template>
  <div id="app" class="container">
    <Header :globals="globals" @router="update" :candidate-permission="candidatePermission"/>
    <div id="body">
      <Body :globals="globals" @router="update" :candidate-permission="candidatePermission"/>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header'
import Body from '@/components/Body'
import translation from '@/translation/translation.json'
import * as _ from 'lodash'
import auth from '@/services/auth'
import backend from '@/services/backend'

export default {
  name: 'App',
  components: {
    Header,
    Body
  },
  data () {
    return {
      parameters: {
        'lang': {
          history: true,
          type: 'STRING',
          onChange: (newValue) => {
            this.globals.hot.GUILang = newValue
          },
          defaultValue: 'swe'
        },
        'view': {
          history: true,
          type: 'STRING',
          onChange: (newValue) => {
            this.globals.hot.currentView = newValue
          },
          defaultValue: 'suggestions'
        },
        'lexicon': {
          history: true,
          type: 'STRING',
          onChange: (newValue) => {
            this.globals.hot.lexicon = newValue
          }
        },
        'identifier': {
          history: true,
          type: 'STRING',
          onChange: (newValue) => {
            this.globals.hot.identifier = decodeURI(newValue)
          },
          defaultValue: ''
        },
        'paradigm': {
          history: true,
          type: 'STRING',
          onChange: (newValue) => {
            this.globals.hot.paradigm = decodeURI(newValue)
          },
          defaultValue: ''
        },
        'overview': {
          history: true,
          type: 'STRING',
          onChange: (newValue) => {
            this.globals.hot.overview = newValue
          },
          defaultValue: 'paradigm'
        },
        'tableFilter': {
          history: true,
          type: 'STRING',
          onChange: (newValue) => {
            this.globals.hot.tableFilter = newValue
          },
          defaultValue: ''
        }
      },
      globals: {
        cold: {
          translations: translation
        },
        hot: {
          GUILang: 'swe',
          currentView: 'suggestions',
          lexicon: 'saldomp', // TODO: this should be configurable or first lexicon returned by backend
          lexiconInfo: {},
          user: {},
          identifier: '',
          paradigm: '',
          overview: 'paradigm',
          tableFilter: {}
        }
      }
    }
  },
  methods: {
    update: function(actions) {
      /*
        Multiple actions in one update let several changes become only one history entry

        actions = [{
          param: "query",
          value: "simple||apa"
        }, ...]
      */
      let state = window.history.state || {}
      let newHistoryEntry = false
      for (let action of actions) {
        let param = this.parameters[action.param]
        if (action.value === param.defaultValue) {
          delete state[action.param]
        } else {
          state[action.param] = action.value
        }
        
        newHistoryEntry = newHistoryEntry || param.history
      }

      if (newHistoryEntry)
        window.history.pushState(state, "dummy", this.buildURL(state));
      else
        window.history.replaceState(state, "dummy", this.buildURL(state));

      this.syncAppState(state)

    },
    buildURL: function(state) {
      return "?" + _.map(_.keys(state), (key) => { return key + "=" + state[key] }).join("&")
    },
    syncAppState: function(state) {
      // Should update the internal state of the application to the provided one.
      // It's either called after the update function has been called by a component
      // or from the window.onpopstate function to make sure the app state is synced with the browser's back/forward buttons

      let oldState = window.lastHistoryState || {}

      let diff = this.diffObjects(state, oldState)
      let invertedDiff = this.diffObjects(oldState, state)

      let handled = {}
      for (let paramID in diff) {
        handled[paramID] = true
        this.syncParam(this.parameters[paramID], state[paramID])
      }
      for (let paramID in invertedDiff) {
        if (!handled[paramID]) {
          // Deleted item (i.e. an item that has changed back to the default)
          let param = this.parameters[paramID]
          this.syncParam(param, param.defaultValue)
        }
      }

      window.lastHistoryState = state
    },
    syncParam: function(param, newValue) {
      let convertedParamValue = this.convertParamValue(newValue, param.type)
      if (param.onChange) param.onChange(convertedParamValue, param.preventAction || false)
    },
    convertParamValue: function(inValue, type = 'STRING') {
      switch(type) {
        case 'STRING':
          return inValue
        case 'NUMBER':
          return Number(inValue)
      }
    },
    makeStartingState: function() {
      let url = window.location.search
      let state = {}
      if (_.includes(url, "?")) {
        url = url.split("?")[1] // Maybe needs some tweaking
        let parts = url.split("&")
        for (let part of parts) {
          let [key, value] = part.split("=")
          state[key] = value
          window.history.replaceState(state, "init")
        }
      } else {
        // Maybe use some default state
      }
      this.syncAppState(state)
    },
    diffObjects: function(object, base) { // REM: This doesn't seem to work with non-existant keys
      /**
       * Deep diff between two object, using lodash
       * @param  {Object} object Object compared
       * @param  {Object} base   Object to compare with
       * @return {Object}        Return a new object who represent the diff
       */
      function changes(object, base) {
        return _.transform(object, function(result, value, key) {
          if (!_.isEqual(value, base[key])) {
            result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value
          }
        })
      }
      return changes(object, base)
    }
  },
  created: function() {
    this.$watch('globals.hot', function() { this.$nextTick() }, {deep: true} )

    let that = this

    window.onpopstate = function(event) {
      if (event.state) {
        that.syncAppState(event.state)
      } else {
        that.makeStartingState()
      }
    }

    // Set up URL to default parameters:
    this.makeStartingState()




    const getUser = function (that) {
      return function(user) {
        if(user) {
          that.globals.hot.user = user
        } else {
          that.globals.hot.user = {authenticated: false, permitted_resources: {"lexica": {}}}
        }
      }
    }
    auth.getUser().then(getUser(this))
  },
  computed: {
    lexicon () {
      return this.globals.hot.lexicon
    },
    candidatePermission () {
      const loggedIn = this.globals.hot.user.authenticated
      if (loggedIn) {
        return this.globals.hot.user.permitted_resources.lexica[this.globals.hot.lexicon].read
      } else {
        return false
      }
    }
  },
  watch: {
    lexicon: {
      immediate: true,
      handler: async function (val, oldVal) {
        const lexiconInfo = await backend.getLexicon(this.globals.hot.lexicon)
        this.globals.hot.lexiconInfo = lexiconInfo
      }
    }
  }
}
</script>

<style>
#body {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
#app {
  margin-top: 15px;
}
</style>
