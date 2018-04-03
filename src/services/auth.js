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
      user.email = response.email
      axios.defaults.headers.common['Authorization'] = token
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
  getUser () {
    if(!_.isEmpty(user)) {
      return user
    } else {
      const token = localStorage.getItem(lsKey)
      if(token) {
        // TODO get the user from the backend or local storage??
        axios.defaults.headers.common['Authorization'] = token
        return {email: "placeholder"}
      } else {
        return null
      }
    }
  }
}