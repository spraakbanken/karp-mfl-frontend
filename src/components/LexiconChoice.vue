<template>
  <b-modal id="lexiconModal" :title="loc('choose_lexicon')">
    <ul>
      <li v-for="lexicon in lexicons" @click="selectLexicon(lexicon)">{{lexicon}}</li>
    </ul>
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
      lexicons: []
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
      this.update('lexicon', lexicon)
      this.updateLexiconInfo()
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
