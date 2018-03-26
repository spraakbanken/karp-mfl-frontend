import axios from 'axios'

const instance = axios.create({
  // TODO: this should be moved to config
  baseURL: 'http://localhost:5000'
})

export default {
  getTODO (username) {
    return instance.get('/TODO')
      .then(function (response) {
        return response.data
      })
      .catch(function (error) {
        console.log(error)
      })
  }
}