<template>
  <div>
    <div>
      <input v-autofocus="true" type="text" :placeholder="loc('give_wordform')" v-for="(wordForm, index) in wordForms" v-model="wordForms[index]">
      <button v-on:click="addWordForm()">+</button>
    </div>
    <select v-model="pos">
      <option v-for="posTag in posTags" :value="posTag">{{posTag}}</option>
    </select>
    <button v-on:click="giveSuggestion()">{{loc('give_suggestion')}}</button>
  </div>
</template>

<script>
import mix from '@/mix'
import backend from '@/services/backend'
import { EventBus } from '@/services/event-bus.js';

export default {
  mixins: [mix],
  name: 'ByWordForm',
  data () {
    return {
      wordForms: [""],
      pos: this.posTags[0]
    }
  },
  methods: {
    addWordForm () {
      this.wordForms.push('')
    },
    async giveSuggestion () {
      const entryInfo = {
        newEntry: true,
        promise: backend.inflect(this.globals.hot.lexicon, this.wordForms, this.pos)
      }
      EventBus.$emit('inflectionResultEvent', entryInfo)
    }
  },
  props: ['pos-tags']
}
</script>

<style scoped>
div {
  margin-top: 20px;
}
</style>
