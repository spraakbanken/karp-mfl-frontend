import axios from 'axios'

const instance = axios.create({
  // TODO: this should be moved to config
  baseURL: 'http://localhost:5000'
})

const lexicon = "TODO"

export default {
  getPosTags () {
    return instance.get('/pos')
      .then(function (response) {
        return response.data.pos
      })
      .catch(function (error) {
        console.log(error)
      })
  },
  inflect (wordForms, pos) {
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
  },
  inflectLike (word, like) {
    const params = {
      word: word,
      like: like,
      lexicon: lexicon
    }
    return instance.get('/inflectlike', params)
      .then(function (response) {
        return response.data
      })
      .catch(function (error) {
        console.log(error)
      })
  }
}