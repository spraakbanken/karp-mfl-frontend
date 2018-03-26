import Vue from 'vue'
import App from '@/App'

Vue.directive('autofocus', {
  inserted: function (el) {
    el.focus()
  }
})

var vm = new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'  
})
