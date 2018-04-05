import axios from 'axios'

// TODO: this should be moved to config
const mflBackend = 'http://localhost:5000'
// const karpBackend = 'https://ws.spraakbanken.gu.se/ws/karp/v4/'
const karpBackend = 'http://localhost:8081/app/'

const instance = axios.create({
  baseURL: mflBackend
})

const karpInstance = axios.create({
  baseURL: karpBackend
})

const helper = function (promise, callback) {
    return promise
      .then(function (response) {
        if(callback) {
          return callback(response.data)
        } else{
          return response.data
        }
      })
      .catch(function (error) {
        console.log(error)
      })
}

export default {
  login (user, password) {
    const auth = window.btoa(user + ':' + password)
    const params = {
      headers: {
        Authorization: 'Basic ' + auth
      }
    }
    return helper(karpInstance.get('/checkuser', params), (data) => {
      data.token = auth
      return data
    })
  },
  autocomplete (lexicon, word) {
    const params = {
      params: {
        q: word,
        resource: lexicon,
        mode: 'external'
      }
    }
    return helper(karpInstance.get('/autocomplete', params), (data) => {
      return _.map(data.hits.hits, (elem) => elem._source.FormRepresentations[0].lemgram)
    })
  },
  getLexicons () {
    return helper(instance.get('/lexicon'), (data) => data.lexicons)
  },
  getLexicon (lexicon) {
    return helper(instance.get('/lexicon/' + lexicon))
  },
  getPosTags (lexicon) {
    const params = {
      params: {
        lexicon: lexicon
      }
    }
    return helper(instance.get('/partofspeech', params), (data) => data.partOfSpeech)
  },
  inflect (lexicon, wordForms, pos) {
    const params = {
      params: {
        table: wordForms.join(','),
        pos: pos,
        lexicon: lexicon
      }
    }
    return helper(instance.get('/inflect', params))
  },
  inflectLike (lexicon, wordform, like) {
    const params = {
      params: {
        wordform: wordform,
        like: like,
        lexicon: lexicon
      }
    }
    return helper(instance.get('/inflectlike', params))
  },
  inflectClass(lexicon, wordform, category, value, pos) {
    const params = {
      params: {
        lexicon: lexicon,
        wordform:	wordform,
        partOfSpeech:	pos,
        classname:	category,
        classval:	value
      }
    }
    return helper(instance.get('/inflectclass', params))
  },
  inflectTable(lexicon, tableRows, pos) {
    console.log('inflectTable', tableRows, pos)
    const params = {
      params: {
        table: _.map(tableRows, function(row) { return row.value + '|' + row.msd }).join(','),
        lexicon: lexicon,
        pos: pos
      }
    }
    return helper(instance.get('/inflect', params))
  },
  compileParadigm: async function (filter) {
    // TODO: use filter when there is backend support
    const data = await this.compile('paradigm')
    return { headers: [data.compiled_on, ...data.fields], data: data.stats }
  },
  compileWordForm: async function () {
    const data = await this.compile('wf')
    const fields = _.keys(data.stats[0].FormRepresentations[0])
    return { headers: fields, data: _.map(data.stats, function(hit) {
      return _.values(hit.FormRepresentations[0])
    })}
  },
  compileClass: async function (className) {
    const data = await this.compile('class', className)
    return { headers: [data.compiled_on, ...data.fields], data: data.stats }
  },
  compile (compileType, className) {
    if (!_.includes(['wf', 'paradigm', 'class'], compileType)) {
      throw Error()
    }
    const params = {
      s: compileType
    }
    if(compileType == 'class') {
      params['classname'] = className
    }
    return helper(instance.get('/compile', {params: params}))
  },
  listParadigm () {
    const params = {
      s: 'paradigm'
    }
    return helper(instance.get('/list', {params: params}), (data) => {
      return data.list
    })
  },
  listClass (className) {
    const params = {
      s: 'class',
      classname: className
    }
    return helper(instance.get('/list', {params: params}), (data) => {
      return data.list
    })
  }
  
}