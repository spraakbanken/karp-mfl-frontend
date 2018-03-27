<template>
  <b-modal id="loginModal" :title="loc('login')" ok-title="Logga in">
    <div>
      <label>{{loc('username')}}:</label>
      <input type='text'>
    </div>
    <div>
      <label>{{loc('password')}}:</label>
      <input type='password'>
    </div>
  </b-modal>
</template>

<script>
import mix from '@/mix'

export default {
  name: 'Login',
  mixins: [mix],
  data () {
    return {
    }
  }
}
</script>

<style scoped>
</style>
