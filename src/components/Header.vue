<template>
  <div class="container">
    <div class="row justify-content-between">
      <div class="col-3">
        <h1><a :href="homeLink">morfologilabbet</a></h1>
      </div>
      <!-- TODO: få allt att vara så mycket åt höger som möjligt, men vi måste få plats med långa användarnamn-->
      <div class="col-5">
        <span class="link" v-if="!loggedIn" v-b-modal.loginModal>{{loc('login')}}</span>
        <span class="link" v-if="loggedIn" @click="logout()">{{loc('logout')}} {{username}}</span>
        <span :class="{ link: langEnglish}" @click="setLang('swe')">Svenska</span>
        <span :class="{ link: langSwedish}" @click="setLang('eng')">English</span>
      </div>
    </div>
    
    <div>
      <a v-b-modal.lexiconModal>{{loc('select_lexicon')}}</a>
      <a v-on:click="gotoCandidateList()" v-bind:class="{ selected: globals.hot.currentView === 'candidatelist' }">{{loc('candidate_list')}}</a>
      <a v-on:click="gotoOverview()" v-bind:class="{ selected: globals.hot.currentView === 'overview' }">{{loc('show_overview')}}</a>
      <a v-on:click="gotoSuggestions()" v-bind:class="{ selected: globals.hot.currentView === 'suggestions' }">{{loc('show_suggestions')}}</a>
      <a v-if="!loggedIn" v-b-modal.loginModal>{{loc('login')}}</a>
      <a v-if="loggedIn" @click="logout()">{{loc('logout')}} {{username}}</a>
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
    padding: 10px;
  }
  a {
    cursor: pointer;
    display: inline;
    color: grey;
  }
  a:hover {
    text-decoration: none;
  }
  .selected {
    font-weight: bold;
  }
  .link {
    color: blue;
    cursor: pointer;
  }
</style>
