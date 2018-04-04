import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from '@/App'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

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
