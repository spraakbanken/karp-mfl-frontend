<template>
  <div>
    <h1><a :href="homeLink">morfologilabbet</a></h1>
    <div>
      <a v-b-modal.lexiconModal>{{loc('select_lexicon')}}</a>
      <a v-on:click="gotoOverview()" v-bind:class="{ selected: globals.hot.currentView == 'overview' }">{{loc('show_overview')}}</a>
      <a v-on:click="gotoSuggestions()" v-bind:class="{ selected: globals.hot.currentView == 'suggestions' }">{{loc('show_suggestions')}}</a>
      <a v-if="!loggedIn" v-b-modal.loginModal>{{loc('login')}}</a>
      <a v-if="loggedIn" @click="logout()">{{loc('logout')}} {{user.username}}</a>
    </div>
    <LangChoice :globals="globals" @router="update" />

    <LexiconChoice :globals="globals" @router="update"/>
    <Login :globals="globals" @router="update" @isAuthenticated="getUser()"/>

  </div>
</template>

<script>
import mix from '@/mix'
import Login from '@/components/Login'
import LangChoice from '@/components/LangChoice'
import LexiconChoice from '@/components/LexiconChoice'
import auth from '@/services/auth'

export default {
  mixins: [mix],
  components: {
    Login,
    LangChoice,
    LexiconChoice
  },
  name: 'Header',
  data () {
    return {
      selected: [false,true],
      loggedIn: false,
      user: {}
    }
  },
  created () {
    this.getUser()
  },
  computed: {
    homeLink () {
      // TODO add language here. problem is that we prefer not use the default language 
      // put there is no easy way to access that information without just getting
      // the value from location bar
      return "/"
    }
  },
  methods: {
    getUser: async function () {
      const user = await auth.getUser()
      if(user) {
        this.user = user
        this.loggedIn = true
      } else {
        this.user = {}
        this.loggedIn = false
      }
    },
    logout () {
      auth.logout()
      this.user = {}
      this.loggedIn = false
    },
    gotoSuggestions () {
      this.update('currentView', 'suggestions')
    },
    gotoOverview () {
      this.update('currentView', 'overview')
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
</style>
