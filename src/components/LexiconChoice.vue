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
  methods: {
    selectLexicon (lexicon) {
      this.update('lexicon', lexicon)
    }
  }
}
</script>

<style scoped>

</style>
