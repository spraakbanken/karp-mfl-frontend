import * as _ from 'lodash'
import config from '../config.json'

export default {
  getCQP (words) {
    return '[' + _.map(words, (word) => {
      return 'word = "' + word + '"'
    }).join(" | ") + ']'
  },
  createKorpLink (words, corpora) {
    const cqp = this.getCQP(words)
    return config.korpFrontend + '#?corpus=' + corpora.join(',') + '&search=cqp&cqp=' + cqp + '&search_tab=1'
  }
}