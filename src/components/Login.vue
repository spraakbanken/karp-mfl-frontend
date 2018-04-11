<template>
  <b-modal id="loginModal" :title="loc('login')" v-model="showLogin">
    <div class="container fluid">
      <div class="row">
        <div class="col">
          <label>{{loc('username')}}:</label>
        </div>
        <div class="col">
          <input type='text' v-model="username">
        </div>
      </div>
      <div class="row">
        <div class="col">
          <label>{{loc('password')}}:</label>
        </div>
        <div class="col">
          <input type='password' v-model="password">
        </div>
      </div>
      <div class="row">
        <div class="col">
          <b-form-checkbox id="checkbox"
                     v-model="rememberLogin">
             {{loc('remember_login')}}
          </b-form-checkbox>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <a target="_blank" href="https://ws.spraakbanken.gu.se/user/password">{{ loc('forgot_passwd') }}</a>
        </div>
      </div>
      <div class="row">
        <div class="col-auto mr-auto"></div>
        <div class="col-auto">
          <button class="btn btn-primary" v-on:click="login()">{{ loc('login') }}</button>
          <button class="btn" @click="showLogin=false">{{ loc('cancel') }}</button>
        </div>
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
        this.username = ''
        this.password = ''
      }
      
    }
  }
}
</script>

<style scoped>
</style>
