import axios from 'axios'
import config from '../config.json'
import korp from './korp.js'

const instance = axios.create({
  baseURL: config.mflBackend
})

const karpInstance = axios.create({
  baseURL: config.karpBackend
})

const korpInstance = axios.create({
  baseURL: config.korpBackend
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
        return error.response.data
      })
}

const serializeInflectionTable = function (table) {
  return _.map(table, function(row) {
    let res = row.writtenForm + '|'
    if (row.show !== undefined && !row.show) {
      res += '*'
    }
    res += row.msd
    return res
  }).join(',')
}

const removeShowPrefix = function (data) {
  _.map(data.WordForms, (wordForm) => {
    if (wordForm.msd[0] === '*') {
      wordForm.msd = wordForm.msd.slice(1) 
    }
  })
  return data
}

const removeShowPrefixList = function (data) {
  _.map(data.Results, (alt) => {
    return removeShowPrefix(alt)
  })
  return data
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
    let mode = ''
    if (lexicon === 'saldomp') {
      mode = 'external'
    } else {
      mode = lexicon
    }
    const params = {
      params: {
        q: word,
        resource: lexicon,
        mode: mode
      }
    }
    return helper(karpInstance.get('/autocomplete', params), (data) => {
      return _.map(data.hits.hits, (elem) => {
        if (elem._source.FormRepresentations) {
          return {identifier: elem._source.FormRepresentations[0].lemgram}
        } else {
          return elem._source
        }
      })
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
  inflect (lexicon, wordForms, pos, restrictToBaseform) {
    const params = {
      params: {
        table: wordForms.join(','),
        pos: pos,
        lexicon: lexicon,
        restrict_to_baseform: restrictToBaseform
      }
    }
    return helper(instance.get('/inflect', params), removeShowPrefixList)
  },
  inflectLike (lexicon, wordform, like, partOfSpeech) {
    const params = {
      params: {
        wordform: wordform,
        like: like.identifier,
        lexicon: lexicon,
        partOfSpeech: like.partOfSpeech
      }
    }
    return helper(instance.get('/inflectlike', params), removeShowPrefixList)
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
    return helper(instance.get('/inflectclass', params), removeShowPrefixList)
  },
  inflectTable(lexicon, tableRows, pos, {restrictToBaseform, strict}) {
    const params = {
      params: {
        table: serializeInflectionTable(tableRows),
        lexicon: lexicon,
        pos: pos
      }
    }
    if (strict) {
      params.params.strict = true
    }
    if (restrictToBaseform !== undefined) {
      params.params.restrict_to_baseform = restrictToBaseform
    }
    return helper(instance.get('/inflect', params), removeShowPrefixList)
  },
  compileParadigm: async function (lexicon, filter,  posTags, size, start, coolFilter) {
    return await this.compile(lexicon, 'paradigm', null, filter,  posTags, size, start, coolFilter)
  },
  compileWordForm: async function (lexicon, filter,  posTags, size, start, coolFilter) {
    return await this.compile(lexicon, 'wf', null, filter,  posTags, size, start, coolFilter)
    return { headers: data.fields, data: data.stats, total: data.total }
  },
  compileClass: async function (lexicon, className, filter,  posTags, size, start, coolFilter) {
    return await this.compile(lexicon, 'class', className, filter,  posTags, size, start, coolFilter)
  },
  compile (lexicon, compileType, className, filter, posTags, size, start, coolFilter) {
    if (!_.includes(['wf', 'paradigm', 'class'], compileType)) {
      throw Error()
    }
    const params = {
      c: compileType,
      size: size,
      start: start,
      lexicon: lexicon,
      partOfSpeech: posTags.join(',')
    }
    const s = []
    const q = []
    if(!_.isEmpty(coolFilter)) {
      s.push(compileType)
      q.push(coolFilter)
      params.filter = true
    }

    _.map(filter, (elem) => {
      s.push(elem[0])
      q.push(elem[1])
    })

    if (!_.isEmpty(s)) {
      params.s = s.join(',')
      params.q = q.join(',')
    }
    if(compileType == 'class') {
      params['classname'] = className
    }
    return helper(instance.get('/compile', {params: params}), (data) => {
      return { headers: data.fields, data: data.stats, total: data.total }
    })
  },
  listParadigm (lexicon) {
    const params = {
      c: 'paradigm',
      lexicon: lexicon
    }
    return helper(instance.get('/list', {params: params}), (data) => {
      return data.list
    })
  },
  listClass (lexicon, className) {
    const params = {
      c: 'class',
      classname: className,
      lexicon: lexicon
    }
    return helper(instance.get('/list', {params: params}), (data) => {
      return data.list
    })
  },
  wordInfo (lexicon, identifier) {
    const params = {
      lexicon,
      identifier
    }
    return helper(instance.get('/wordinfo', {params: params}), removeShowPrefix)
  },
  paradigmInfo (lexicon, paradigm) {
    const params = {
      lexicon: lexicon,
      short: true
    }
    return helper(instance.get('/paradigminfo/' + paradigm, {params: params}), (data) => {
      _.map(data.TransformSet, (row) => {
        if (row.GrammaticalFeatures.msd[0] === '*') {
          row.GrammaticalFeatures.msd = row.GrammaticalFeatures.msd.slice(1)
          row.show = false
        } else {
          row.show = true
        }
      })
      data.VariableInstances = data.Top_VariableInstances
      delete data.Top_VariableInstances
      return data
    })
  },
  addUpdateTable (path, lexicon, table, partOfSpeech, paradigm, identifier, newParadigm, classes) {
    const params = {
      lexicon, 
      table: serializeInflectionTable(table),
      partOfSpeech, 
      paradigm,
      identifier,
      new: newParadigm,
      classes: _.map(classes, function (elem)  {
        return elem.name + ":" + elem.value
      }).join(",")
    }
    return helper(instance.get(path, {params: params}), (data) => {
      return data
    })
  },
  addTable (lexicon, table, partOfSpeech, paradigm, identifier, newParadigm, classes) {
    return this.addUpdateTable('/addtable', lexicon, table, partOfSpeech, paradigm, identifier, newParadigm, classes)
  },
  updateTable (lexicon, table, partOfSpeech, paradigm, identifier, newParadigm, classes) {
    return this.addUpdateTable('/updatetable', lexicon, table, partOfSpeech, paradigm, identifier, newParadigm, classes)
  },
  defaultTable (lexicon, partOfSpeech) {
    return helper(instance.get('/defaulttable', { params: { partOfSpeech, lexicon } }), (data) => {
      return _.map(data.WordForms, (wordForm) => wordForm.msd)
    })
  },
  getCandidateList (lexicon) {
    return helper(instance.get('/candidatelist', { params: { lexicon }}), (data) => {
      const rows = _.map(data.candidates, (candidate) => {
        let paradigm = ''
        if (candidate.CandidateParadigms.length > 0) {
          paradigm = candidate.CandidateParadigms[0].name
        } else {
          paradigm = ''
        }
        const score = candidate.maxScore
        return {identifier: candidate.identifier, paradigm: paradigm, score: score, baseform: candidate.baseform}
      })
      return rows
    })
  },
  addCandidates (lexicon, newCandidates) {
    const options = {
      params: {
        lexicon: lexicon
      },
      headers: {
        'content-type': 'text/plain'
      }
    }
    return helper(instance.post('/addcandidates', newCandidates, options), (data) => {
      const rows = _.map(data.saved, (candidate) => {
        let paradigm = ''
        if (candidate.CandidateParadigms.length > 0) {
          paradigm = candidate.CandidateParadigms[0].name
        } else {
          paradigm = ''
        }
        const score = candidate.maxScore
        return {identifier: candidate.identifier, paradigm: paradigm, score: score, baseform: candidate.baseform}
      })
      return rows
    })
  },
  recomputeCandidates (lexicon) {
    // , { params: { lexicon }}
    return helper(instance.get('/recomputecandidates'))
  },
  inflectCandidate (lexicon, identifier) {
    const params = {
      lexicon: lexicon,
      identifier: identifier
    }
    return helper(instance.get('/inflectcandidate', {params: params}), removeShowPrefix)
  },
  removeCandidate (lexicon, identifier) {
    const params = {
      lexicon: lexicon,
      identifier: identifier
    }
    return helper(instance.get('/removecandidate', {params: params}))
  },
  countOccurrences (corpora, wordForm) {
    const params = {
      corpus: corpora.join(','),
      cqp: korp.getCQP([wordForm]),
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