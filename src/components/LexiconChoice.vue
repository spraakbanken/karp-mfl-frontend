<template>
  <b-modal id="lexiconModal" :title="loc('select_lexicon')" v-model="showLexiconModal">
    <ul>
      <li v-for="lexicon in lexicons" @click="selectLexicon(lexicon.name)" v-if="lexicon.allowed">
        <icon name="lock-open"></icon>
        <span class="lex-link" :style="getLexiconStyle(lexicon.name)">{{lexicon.name}}</span>
      </li>
      <li v-for="lexicon in lexicons" v-if="!lexicon.allowed">
        <icon name="lock"></icon>
        <span>{{lexicon.name}}</span>
      </li>
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
  watch: {
    showLexiconModal: async function () {
      const lexicons = await backend.getLexicons()
      _.map(lexicons, (lexicon) => {
        if (lexicon.open) {
          lexicon.allowed = true
        } else {
          const lexiconPermissions = this.globals.hot.user.permitted_resources.lexica[lexicon.name]
          lexicon.allowed = lexiconPermissions && lexiconPermissions.read
        }
      })
      this.lexicons = lexicons
    }
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
.lex-link {
  cursor: pointer;
}
</style>
