<template>
  <div>
    <input v-autofocus="true" type="text" :placeholder="loc('give_wordform')" v-model="wordForm">
    {{loc('inflect_like')}}
    <input v-autofocus="true" type="text" v-model="autocompleteInput" :placeholder="selectedLemgram" />
    <div v-for="something in alternatives" @click="selectLemgram(something)">
      {{something}}
    </div>
    <button v-on:click="giveSuggestion()">{{loc('give_suggestion')}}</button>
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
      selectedLemgram: '',
      alternatives: []
    }
  },
  watch: {
    autocompleteInput: function (newer, older) {
      this.getAutocomplete()
    }
  },
  methods: {
    async giveSuggestion () {
      EventBus.$emit('inflectionResultEvent', await backend.inflectLike(this.globals.hot.lexicon, this.wordForm, this.selectedLemgram))
    },
    getAutocomplete: _.debounce(
      function () {
        var vm = this
        if(this.autocompleteInput.length > 0) {
          backend.autocomplete(this.globals.hot.lexicon, this.autocompleteInput)
            .then(function (response) {
              console.log('response', response)
              vm.alternatives = response
            })
        }
      },
      500
    ),
    selectLemgram (lemgram) {
      this.autocompleteInput = ''
      this.selectedLemgram = lemgram
      this.alternatives = []
    }
  }
}
</script>

<style scoped>
div {
  margin-top: 20px;
}
</style>
