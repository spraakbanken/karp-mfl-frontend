<template>
  <b-modal id="loginModal" :title="loc('login')" v-model="showLogin">
    <div class="container fluid">
      <div class="row">
        <label>{{loc('username')}}:</label>
        <input type='text' v-model="username">
      </div>
      <div class="row">
        <label>{{loc('password')}}:</label>
        <input type='password' v-model="password">
      </div>
      <div class="row">
        <input type='checkbox' v-model="rememberLogin">
        <label>{{loc('remember_login')}}</label>
      </div>
      <div class="row">
        <a target="_blank" href="https://ws.spraakbanken.gu.se/user/password">{{ loc('forgot_passwd') }}</a>
      </div>
      <div class="row">
        <button v-on:click="login()">{{ loc('login') }}</button>
        <button @click="showLogin=false">{{ loc('cancel') }}</button>
      </div>
    </div>
    <div slot="modal-footer"></div>
  </b-modal>
</template>

<script>
import mix from '@/mix'
import auth from '@/services/auth'

export default {
  name: 'Login',
  mixins: [mix],
  data () {
    return {
      username: '',
      password: '',
      rememberLogin: false,
      showLogin: false
    }
  },
  methods: {
    login: async function() {
      const [loggedIn, user] = await auth.login(this.username, this.password, this.rememberLogin)
      if(loggedIn) {
        this.globals.hot.user = user
        this.showLogin = false
      }
      
    }
  }
}
</script>

<style scoped>
</style>
