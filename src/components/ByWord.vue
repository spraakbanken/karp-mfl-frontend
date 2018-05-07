<template>
  <div class="row">
    <div class="col-auto">
      <input v-autofocus="true" type="text" :placeholder="loc('give_wordform')" v-model="wordForm">
    </div>
    <div class="col-auto">
      {{loc('inflect_like')}}
    </div>
    <div class="col-auto">
      <input v-autofocus="true" type="text" v-model="autocompleteInput" :placeholder="prettyPrint(selectedIdentifier)" />
      <div class="list-group">
        <div class="pointer list-group-item list-group-item-action" v-for="something in alternatives" @click="selectIdentifier(something)">
          {{prettyPrint(something)}}
        </div>
      </div>
    </div>
    <div class="col-auto">
      <button class="btn btn-primary" v-on:click="giveSuggestion()" :disabled="noInput">{{loc('give_suggestion')}}</button>
    </div>
  </div>
</template>

<script>
import mix from '@/mix'
import backend from '@/services/backend'
import { EventBus } from '@/services/event-bus.js';

export default {
  mixins: [mix],
  name: 'ByWord',
  data () {
    return {
      wordForm: '',
      autocompleteInput: '',
      selectedIdentifier: '',
      alternatives: [],
      partOfSpeech: ''
    }
  },
  computed: {
    noInput () {
      return _.isEmpty(this.wordForm) || _.isEmpty(this.selectedIdentifier)
    }
  },
  watch: {
    autocompleteInput: function (newer, older) {
      this.getAutocomplete()
    }
  },
  methods: {
    async giveSuggestion () {
      const entryInfo = {
        newEntry: true,
        promise: backend.inflectLike(this.globals.hot.lexicon, this.wordForm, this.selectedIdentifier)
      }
      EventBus.$emit('inflectionResultEvent', entryInfo)
    },
    getAutocomplete: _.debounce(
      function () {
        const vm = this
        if(this.autocompleteInput.length > 0) {
          backend.autocomplete(this.globals.hot.lexicon, this.autocompleteInput)
            .then(function (response) {
              vm.alternatives = response
            })
        }
      },
      500
    ),
    selectIdentifier (identifier) {
      this.autocompleteInput = ''
      this.selectedIdentifier = identifier
      this.alternatives = []
    },
    prettyPrint (word) {
      if (!word) {
        return ''
      }
      
      let result = ''
      if (word.baseform) {
        result += word.baseform
        if (word.partOfSpeech) {
          result += ' (' + word.partOfSpeech + ')'
        }
        result += ' - '
      }
      result += word.identifier
      return result
    }
  }
}
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>
