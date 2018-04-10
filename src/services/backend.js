import axios from 'axios'

// TODO: this should be moved to config
const mflBackend = 'http://localhost:5000'
// const karpBackend = 'https://ws.spraakbanken.gu.se/ws/karp/v4/'
const karpBackend = 'http://localhost:8081/app/'
const korpBackend = 'https://ws.spraakbanken.gu.se/ws/korp/v7'

const instance = axios.create({
  baseURL: mflBackend
})

const karpInstance = axios.create({
  baseURL: karpBackend
})

const korpInstance = axios.create({
  baseURL: korpBackend
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

const serializeInflectionTable = function (table) {
  return _.map(table, function(row) { return row.writtenForm + '|' + row.msd }).join(',')
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
        table: serializeInflectionTable(tableRows),
        lexicon: lexicon,
        pos: pos
      }
    }
    return helper(instance.get('/inflect', params))
  },
  compileParadigm: async function (filter) {
    const data = await this.compile('paradigm', null, filter)
    return { headers: [data.compiled_on, ...data.fields], data: data.stats }
  },
  compileWordForm: async function (filter) {
    const data = await this.compile('wf', null, filter)
    return { headers: data.fields, data: data.stats }
  },
  compileClass: async function (className, filter) {
    const data = await this.compile('class', className, filter)
    return { headers: [data.compiled_on, ...data.fields], data: data.stats }
  },
  compile (compileType, className, filter) {
    if (!_.includes(['wf', 'paradigm', 'class'], compileType)) {
      throw Error()
    }
    const params = {
      c: compileType
    }
    if (filter) {
      params.s = filter.searchField
      params.q = filter.searchValue
    }
    if(compileType == 'class') {
      params['classname'] = className
    }
    return helper(instance.get('/compile', {params: params}))
  },
  listParadigm () {
    const params = {
      c: 'paradigm'
    }
    return helper(instance.get('/list', {params: params}), (data) => {
      return data.list
    })
  },
  listClass (className) {
    const params = {
      c: 'class',
      classname: className
    }
    return helper(instance.get('/list', {params: params}), (data) => {
      return data.list
    })
  },
  addTable (lexicon, table, partOfSpeech, paradigm, identifier, newParadigm) {
    const params = {
      lexicon, 
      table: serializeInflectionTable(table),
      partOfSpeech, 
      paradigm,
      identifier,
      new: newParadigm
    }
    return helper(instance.get('/addtable', {params: params}), (data) => {
      return data
    })
  },
  defaultTable (lexicon, partOfSpeech) {
    return helper(instance.get('/defaulttable', { params: { partOfSpeech } }), (data) => {
      return _.map(data.WordForms, (wordForm) => wordForm.msd)
    })
  },
  getCandidateList () {
    return helper(instance.get('/candidatelist'), (data) => {
       const rows = _.map(data.candidates, (candidate) => {
        const paradigm = candidate.CandidateParadigms[0].name
        const score = candidate.maxScore
        return [candidate.baseform, paradigm, score]
      })
      return {headers: ["baseform", "paradigm", "score"], data: rows}
    })
  },
  countOccurrences (corpora, wordForm) {
    const params = {
      corpus: corpora.join(','),
      cqp: '[word = "' + wordForm + '"]',
      groupby: 'word'
    }
    return helper(korpInstance.get('/count', {params: params}), (data) => {
      if (_.isEmpty(data.total.absolute)) {
        return 0
      } else {
        return data.total.absolute[0].freq
      }
    })
  }
}