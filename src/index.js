
import Vue from 'vue'
import App from '@/App'
import router from '@/router'

var initState = {
  notUsed: {}
}

var vm = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  data: initState
})

vm.$watch('notUsed', function (oldVal, newVal) {
  console.log('notUsed', notUsed)
})
