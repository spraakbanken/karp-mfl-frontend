import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from '@/App'

import 'vue-awesome/icons/minus-circle'
import 'vue-awesome/icons/plus-circle'
import 'vue-awesome/icons/times-circle'
import 'vue-awesome/icons/spinner'
import 'vue-awesome/icons/eye'
import 'vue-awesome/icons/lock'
import 'vue-awesome/icons/lock-open'
import 'vue-awesome/icons/pencil-alt'
import Icon from 'vue-awesome/components/Icon'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.component('icon', Icon)

Vue.use(BootstrapVue)

Vue.directive('autofocus', {
  inserted: function (el) {
    el.focus()
  }
})

const vm = new Vue({
  el: '#app',
  components: { App },
  template: '<App/>' 
})
