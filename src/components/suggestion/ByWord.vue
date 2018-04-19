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
      <div v-for="something in alternatives" @click="selectIdentifier(something)">
        {{prettyPrint(something)}}
      </div>
    </div>
    <div class="col-auto">
      <button class="btn btn-primary" v-on:click="giveSuggestion()">{{loc('give_suggestion')}}</button>
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
      // TODO: for saol we will have baseform and part of speech to print also
      return word.identifier
    }
  }
}
</script>

<style scoped>

</style>
