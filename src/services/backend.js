import axios from 'axios'

const instance = axios.create({
  // TODO: this should be moved to config
  baseURL: 'http://localhost:5000'
})

export default {
  getPosTags (lexicon) {
    return instance.get('/pos')
      .then(function (response) {
        return response.data.pos
      })
      .catch(function (error) {
        console.log(error)
      })
  }
}