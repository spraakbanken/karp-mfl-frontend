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
    console.log("inflect", wordForms, pos)
    const params = {
      table: wordForms.join(','),
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
    console.log("inflectClass", word, like)
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
  },
  inflectClass(word, category, value, pos) {
    console.log("inflectClass", word, category, value, pos)
    const params = {
      word: word,
      class: category,
      lexicon: lexicon,
      pos: pos
    }
    params[category] = value
    return instance.get('/inflectlike', params)
      .then(function (response) {
        return response.data
      })
      .catch(function (error) {
        console.log(error)
      })
  },
  inflectTable(tableRows, pos) {
    console.log("inflectTable", tableRows, pos)
    const params = {
      table: _.map(tableRows, function(row) { return row.msd + '|' + row.value }).join(','),
      lexicon: lexicon,
      pos: pos
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