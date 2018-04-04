import backend from '@/services/backend'
import axios from 'axios'
import * as _ from 'lodash'

const lsKey = 'mfllogin'
var user = {}

export default {
  login (username, password, remember) {
    return backend.login(username, password).then(function(response) {
      const token = response.token
      if(remember) {
        localStorage.setItem(lsKey, token)
      }
      user = response
      axios.defaults.headers.common['Authorization'] = "Basic " + token
      return true
    }).catch(err => {
      delete axios.defaults.headers.common['Authorization']
      localStorage.removeItem(lsKey)
      return false
    })
  },
  logout () {
    delete axios.defaults.headers.common['Authorization']
    localStorage.removeItem(lsKey)
    user = {}
  },
  getUser: async function () {
    if(!_.isEmpty(user)) {
      return user
    } else {
      const token = localStorage.getItem(lsKey)
      if(token) {
        const [username, password] = window.atob(token).split(":")
        if(await this.login(username, password, true)) {
          return user
        } else {
          return null
        }
      } else {
        return null
      }
    }
  }
}