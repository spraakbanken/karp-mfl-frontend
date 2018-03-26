import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/SuggestionsMain'

Vue.use(Router)

var router = new Router({
  routes: [
    {
      path: '/',
      name: 'SuggestionsMain',
      component: Main
    }
  ]
})

export default router
