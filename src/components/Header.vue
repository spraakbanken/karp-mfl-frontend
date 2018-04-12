<template>
  <div class="container">
    <div class="row">
      <div class="col-auto mr-auto"></div>
      <div class="col-auto">
        <span class="link headerLink" v-b-modal.lexiconModal>{{loc('select_lexicon')}}</span>
        <span v-if="langEnglish" class="link headerLink" @click="setLang('swe')">Svenska</span>
        <span v-if="langSwedish" class="link headerLink" @click="setLang('eng')">English</span>
        <span class="link headerLink" v-if="!loggedIn" v-b-modal.loginModal>{{loc('login')}}</span>
        <span class="link headerLink" v-if="loggedIn" @click="logout()">{{loc('logout')}} {{username}}</span>
      </div>
    </div>
    <div class="row justify-content-start">
      <div class="col">
        <h1><a :href="homeLink">morfologilabbet</a></h1>
      </div>
    </div>
    
    <div class="row">
      <div v-if="candidatePermission" class="col-auto">
        <a v-on:click="gotoCandidateList()" v-bind:class="{ selected: globals.hot.currentView === 'candidatelist' }">{{loc('candidate_list')}}</a>
      </div>
      <div class="col-auto">
        <a v-on:click="gotoOverview()" v-bind:class="{ selected: globals.hot.currentView === 'overview' }">{{loc('show_overview')}}</a>
      </div>
      <div class="col-auto">
        <a v-on:click="gotoSuggestions()" v-bind:class="{ selected: globals.hot.currentView === 'suggestions' }">{{loc('show_suggestions')}}</a>
      </div>
    </div>

    <LexiconChoice :globals="globals" @router="update"/>
    <Login :globals="globals" @router="update"/>

  </div>
</template>

<script>
import mix from '@/mix'
import Login from '@/components/Login'
import LexiconChoice from '@/components/LexiconChoice'
import auth from '@/services/auth'

export default {
  mixins: [mix],
  components: {
    Login,
    LexiconChoice
  },
  name: 'Header',
  props: ['candidatePermission'],
  data () {
    return {
      selected: [false,true]
    }
  },
  computed: {
    homeLink () {
      // TODO add language here. problem is that we prefer not use the default language 
      // put there is no easy way to access that information without just getting
      // the value from location bar
      return '/'
    },
    loggedIn () {
      return this.globals.hot.user.authenticated
    },
    username () {
      return this.globals.hot.user.username
    },
    langSwedish () {
      return this.globals.hot.GUILang === 'swe'
    },
    langEnglish () {
      return this.globals.hot.GUILang === 'eng'
    }
  },
  methods: {
    logout () {
      auth.logout()
      // TODO: this should be done in some other way
      this.globals.hot.user = {authenticated: false, permitted_resources: {'lexica': {}}}
    },
    gotoSuggestions () {
      this.update('view', 'suggestions')
    },
    gotoOverview () {
      this.update('view', 'overview')
    },
    gotoCandidateList () {
      this.update('view', 'candidatelist')
    },
    setLang: function(lang) {
      this.update('lang', lang)
    }
  }
}
</script>

<style>
h1 {
  color: grey;
}
a {
  cursor: pointer;
  display: inline;
  color: darkgrey;
}
a:hover {
  text-decoration: none;
  color: grey;
}
.selected {
  font-weight: bold;
}
.link {
  color: blue;
  cursor: pointer;
}
.headerLink {
  padding: 10px;
}
</style>
