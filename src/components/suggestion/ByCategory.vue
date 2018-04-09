<template>
  <div>
    <input v-autofocus="true" type="text" :placeholder="loc('give_wordform')" v-model="wordForm">
    <div>
      <input type="radio" name="cateogry" value="paradigm" v-model="selectedCategory">
      <label>{{loc('paradigm')}}</label>
      <template v-for="category in categories">
        <input type="radio" name="cateogry" :value="category" v-model="selectedCategory">
        <label for="categoryRadio">{{loc(category)}}</label>
      </template>
    </div>
    <select v-model="selectedValue">
      <option v-for="val in categoryValues":value="val[0]">{{val[0] + "(" + val[1] + ")"}}</option>
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
  name: 'ByCategory',
  data () {
    return {
      wordForm: '',
      selectedCategory: 'paradigm',
      selectedValue: '',
      categoryValues: []
    }
  },
  computed: {
    categories () {
      return this.globals.hot.lexiconInfo.possible_lexiconFields
    }
  },
  watch: {
    selectedCategory: {
      immediate: true,
      handler: async function (val, oldVal) {
        if(val === 'paradigm') {
          this.categoryValues = await backend.listParadigm()
        } else {
          this.categoryValues = await backend.listClass(val)
        }
      }
    }
  },
  methods: {
    async giveSuggestion () {
      EventBus.$emit('inflectionResultEvent', await backend.inflectClass(this.globals.hot.lexicon, this.wordForm, this.selectedCategory, this.selectedValue))
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
