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
import { EventBus } from '@/services/event-bus.js'

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
      // Check if lang is included in path (to avoid adding the default language)
      // if it is included, use value from this.globals.hot to make sure
      // homeLink is updated properly
      let langFound = false
      let trigger = this.globals.hot.GUILang
      for(const elem of location.search.slice(1).split('&')) {
        if(elem.split('=')[0] === 'lang') {
          langFound = true
          break
        }
      }
      let path = location.pathname
      if(langFound) {
        path += '?lang=' + trigger
      }
      return path
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
      this.globals.hot.user = this.globals.cold.defaultUser
    },
    gotoSuggestions () {
      EventBus.$emit('routing', {view: 'suggestions'})
    },
    gotoOverview () {
      EventBus.$emit('routing', {view: 'overview'})
    },
    gotoCandidateList () {
      EventBus.$emit('routing', {view: 'candidatelist'})
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
