<template>
  <b-modal id="lexiconModal" :title="loc('select_lexicon')" v-model="showLexiconModal">
    <ul>
      <li v-for="lexicon in lexicons" @click="selectLexicon(lexicon)">{{lexicon}}</li>
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
  created: function () {
    this.updateLexiconInfo()
  },
  methods: {
    selectLexicon (lexicon) {
      if(lexicon !== this.globals.hot.lexicon) {
        this.update('lexicon', lexicon)
        this.showLexiconModal = false
        this.updateLexiconInfo()
      }
    },
    updateLexiconInfo: async function () {
      const lexiconInfo = await backend.getLexicon(this.globals.hot.lexicon)
      this.globals.hot.lexiconInfo = lexiconInfo
    }
  }
}
</script>

<style scoped>

</style>
