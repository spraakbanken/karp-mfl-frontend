import * as _ from 'lodash'
export default {
  props: ['globals'],
  created: function() {
    this.$watch('globals.hot', function() { this.$nextTick() }, {deep: true} )
  },
  methods: {
    loc: function(value) {
      if (_.isString(value)) {
        let translations = this.globals.cold.translations

        if (translations[value]) {
          return translations[value][this.globals.hot.GUILang]
        } else {
          console.log('%cMissing translation: "' + value + '"', 'color:orange')
          return value
        }
      } else {
        return value[this.globals.hot.GUILang] || value.all
      }
    },
    update: function(p1, p2) {
      /* 
        Callable with:
          update({param: "lang", value: "swe"})
          update([{param: "lang", value: "swe"}])
          update("query", "swe")
      */
      let updates = []
      if (p2 !== undefined) {
        updates = [{param: p1, value: p2}]
      } else {
        if (_.isArray(p1)) {
          updates = p1
        } else {
          updates = [p1]
        }
      }
      this.$emit('router', updates)
    }
  }
  
}

/*
  TIP: <another v-on:router="update"/> will send the event to the next level.
*/