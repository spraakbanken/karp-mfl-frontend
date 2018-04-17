<template>
  <b-modal id="lexiconModal" :title="loc('select_lexicon')" v-model="showLexiconModal">
    <ul>
      <li v-for="lexicon in lexicons" @click="selectLexicon(lexicon.name)"><span :style="getLexiconStyle(lexicon.name)">{{lexicon.name}}</span> ({{lexicon.open ? 'open' : 'closed'}})</li>
    </ul>
    <div slot="modal-footer"></div>
  </b-modal>
</template>


<script>
import mix from '@/mix'
import backend from '@/services/backend'

export default {
  mixins: [mix],
  name: 'LexiconChoice',
  data () {
    return {
      lexicons: [],
      showLexiconModal: false
    }
  },
  mounted: async function () {
    // TODO: this get done even though modal isnt open
    this.lexicons = await backend.getLexicons()
  },
  methods: {
    selectLexicon (lexicon) {
      if(lexicon !== this.globals.hot.lexicon) {
        this.update('lexicon', lexicon)
        this.showLexiconModal = false
      }
    },
    getLexiconStyle (lexicon) {
      if(lexicon === this.globals.hot.lexicon) {
        return {'font-weight': 'bold'}
      } else {
        return {}
      }
    }
  }
}
</script>

<style scoped>
ul {
  list-style-type: none;
}
</style>
