import backend from '@/services/backend'
import axios from 'axios'
import * as _ from 'lodash'

const lsKey = 'mfllogin'

export default {
  login (username, password, remember) {
    return backend.login(username, password).then(function(response) {
      const token = response.token
      if(remember) {
        localStorage.setItem(lsKey, token)
      }
      axios.defaults.headers.common['Authorization'] = 'Basic ' + token
      return [true, response]
    }).catch(err => {
      delete axios.defaults.headers.common['Authorization']
      localStorage.removeItem(lsKey)
      return [false, {}]
    })
  },
  logout () {
    delete axios.defaults.headers.common['Authorization']
    localStorage.removeItem(lsKey)
  },
  getUser: async function () {
    const token = localStorage.getItem(lsKey)
    if(token) {
      const [username, password] = window.atob(token).split(':')
      const [loggedIn, user] = await this.login(username, password, true)
      if(loggedIn) {
        return user
      }
    }
    return null
  }
}