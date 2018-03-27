<template>
  <div>
    <h1>morfologilabbet</h1>
    <div>
      <a>{{loc('select_lexicon')}}</a>
      <a v-on:click="gotoOverview()" v-bind:class="{ selected: globals.hot.currentView == 'overview' }">{{loc('show_overview')}}</a>
      <a v-on:click="gotoSuggestions()" v-bind:class="{ selected: globals.hot.currentView == 'suggestions' }">{{loc('show_suggestions')}}</a>
      |
      <LangChoice :globals="globals" @router="update" />
      |
      <a v-if="!loggedIn" v-b-modal.loginModal>{{loc('login')}}</a>
      <a v-if="loggedIn">{{loc('logout')}}</a>
    </div>

    <Login :globals="globals" @router="update"/>

  </div>
</template>

<script>
import mix from '@/mix'
import Login from '@/components/Login'
import LangChoice from '@/components/LangChoice'

export default {
  mixins: [mix],
  components: {
    Login,
    LangChoice
  },
  name: 'Header',
  data () {
    return {
      selected: [false,true],
      loggedIn: false
    }
  },
  methods: {
    gotoSuggestions () {
      this.update('currentView', 'suggestions')
    },
    gotoOverview () {
      this.update('currentView', 'overview')
    }
  }
}
</script>

<style scoped>
  h1 {
    color: grey;
  }
  a {
    padding: 10px;
    display: inline;
  }
  .selected {
    font-weight: bold;
  }
</style>
