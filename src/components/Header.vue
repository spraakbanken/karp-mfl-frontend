<template>
  <div>
    <h1><a :href="homeLink">morfologilabbet</a></h1>
    <div>
      <a v-b-modal.lexiconModal>{{loc('select_lexicon')}}</a>
      <a v-on:click="gotoOverview()" v-bind:class="{ selected: globals.hot.currentView == 'overview' }">{{loc('show_overview')}}</a>
      <a v-on:click="gotoSuggestions()" v-bind:class="{ selected: globals.hot.currentView == 'suggestions' }">{{loc('show_suggestions')}}</a>
      <a v-if="!loggedIn" v-b-modal.loginModal>{{loc('login')}}</a>
      <a v-if="loggedIn" @click="logout()">{{loc('logout')}} {{username}}</a>
    </div>
    <LangChoice :globals="globals" @router="update" />

    <LexiconChoice :globals="globals" @router="update"/>
    <Login :globals="globals" @router="update"/>

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
      selected: [false,true]
    }
  },
  computed: {
    homeLink () {
      // TODO add language here. problem is that we prefer not use the default language 
      // put there is no easy way to access that information without just getting
      // the value from location bar
      return "/"
    },
    loggedIn () {
      return this.globals.hot.user.authenticated
    },
    username () {
      return this.globals.hot.user.username
    }
  },
  methods: {
    logout () {
      auth.logout()
      // TODO: this should be done in some other way
      this.globals.hot.user = {authenticated: false, permitted_resources: {"lexica": {}}}
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
