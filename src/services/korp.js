import * as _ from 'lodash'
import config from '../config.json'

export default {
  getCQP (words) {
    return '[' + _.map(words, (word) => {
      return 'word = "' + word + '"'
    }).join(" | ") + ']'
  },
  createKorpLink (words, lexicon) {
    const cqp = this.getCQP(words)
    const instance = config.lexicon[lexicon].korp.frontendInstance
    const corpora = config.lexicon[lexicon].korp.corpora
    let mode = ''
    if (config.lexicon[lexicon].korp.mode) {
      mode = '?mode=' + config.lexicon[lexicon].korp.mode
    }
    return instance + mode + '#?corpus=' + corpora.join(',') + '&search=cqp&cqp=' + cqp + '&search_tab=1'
  }
}