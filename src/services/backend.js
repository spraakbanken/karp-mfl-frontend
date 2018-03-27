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
  },
  inflect (lexicon, wordForms, pos) {
    const params = {
      table: wordForms.join('|'),
      pos: pos,
      lexicon: lexicon
    }
    return instance.get('/inflect', params)
      .then(function (response) {
        return response.data
      })
      .catch(function (error) {
        console.log(error)
      })
  }
}