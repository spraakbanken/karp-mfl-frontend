<template>
  <div>
    <h1>morfologilabbet</h1>
    <ul>
      <li>{{loc('select_lexicon')}}</li>
      <li v-on:click="gotoOverview()" v-bind:class="{ selected: globals.hot.currentView == 'overview' }">{{loc('show_overview')}}</li>
      <li v-on:click="gotoSuggestions()" v-bind:class="{ selected: globals.hot.currentView == 'suggestions' }">{{loc('show_suggestions')}}</li>
      <li v-if="!loggedIn" v-b-modal.loginModal>{{loc('login')}}</li>
      <li v-if="loggedIn">{{loc('logout')}}</li>
    </ul>

    <Login :globals="globals" @router="update"/>

  </div>
</template>

<script>
import mix from '@/mix'
import Login from '@/components/Login'

export default {
  mixins: [mix],
  components: {
    Login
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
  li {
    padding: 10px;
    display: inline;
  }
  .selected {
    font-weight: bold;
  }
</style>
