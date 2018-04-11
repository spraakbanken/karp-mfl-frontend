<template>
  <div class="col-4">
    <div class="row justify-content-around" v-for="(wordForm, index) in wordForms">
      <div class="col">
        <input v-autofocus="true" type="text" :placeholder="loc('give_wordform')" v-model="wordForms[index]">
      </div>
      <div class="col-auto">
        <button v-if="wordForms.length > 1" v-on:click="removeWordForm(index)">-</button>
      </div>
    </div>
    <div class="row justify-content-end">
      <div class="col-auto">
        <button v-on:click="addWordForm()">+</button>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <select v-model="pos">
          <option v-for="posTag in posTags" :value="posTag">{{posTag}}</option>
        </select>
      </div>
    </div>
    <div class="row justify-content-end">
      <div class="col-auto">
        <button class="btn btn-primary" v-on:click="giveSuggestion()">{{loc('give_suggestion')}}</button>
      </div>
    </div>
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
    removeWordForm (idx) {
      this.wordForms.splice(idx, 1)
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

</style>
