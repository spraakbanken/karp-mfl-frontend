<template>
  <b-modal id="loginModal" :title="loc('login')" ok-title="Logga in" v-model="showLogin">
    <div>
      <label>{{loc('username')}}:</label>
      <input type='text' v-model="username">
    </div>
    <div>
      <label>{{loc('password')}}:</label>
      <input type='password' v-model="password">
      <input type='checkbox' v-model="rememberLogin">
      <label>{{loc('remember_login')}}</label>
      <a target="_blank" href="https://ws.spraakbanken.gu.se/user/password">{{ loc('forgot_passwd') }}</a>
      <button v-on:click="login()">{{ loc('login') }}</button>
      <button @click="showLogin=false">{{ loc('cancel') }}</button>
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
      username: "",
      password: "",
      rememberLogin: false,
      showLogin: false
    }
  },
  methods: {
    login: async function() {
      if(await auth.login(this.username, this.password, this.rememberLogin)) {
        this.$emit("isAuthenticated")
        this.showLogin = false
      }
    }
  }
}
</script>

<style scoped>
</style>
