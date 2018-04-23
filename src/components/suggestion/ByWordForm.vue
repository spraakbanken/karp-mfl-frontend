<template>
  <div class="col-5">
    <div class="row justify-content-around" v-for="(wordForm, index) in wordForms">
      <div class="col">
        <input v-autofocus="true" type="text" :placeholder="loc('give_wordform')" v-model="wordForms[index]">
        <span v-if="index + 1 == wordForms.length" v-on:click="addWordForm()">
        <icon name="plus-circle"></icon></span>
        <span v-if="wordForms.length > 1" v-on:click="removeWordForm(index)">
        <icon name="minus-circle"></icon></span>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col">
        <OfflineTypeahead :dataset="posTags" v-model="pos" :placeholder="loc('choose_pos')" any-val="true" />
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
import { EventBus } from '@/services/event-bus.js'
import OfflineTypeahead from '@/components/helpers/OfflineTypeahead'

export default {
  mixins: [mix],
  name: 'ByWordForm',
  components: {
    OfflineTypeahead
  },
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
