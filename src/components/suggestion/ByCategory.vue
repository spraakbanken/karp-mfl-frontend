<template>
  <div>
    <input v-autofocus="true" type="text" :placeholder="loc('give_wordform')" v-model="wordForm">
    <div>
      <template v-for="category in categories">
        <input type="radio" name="cateogry" :value="category.name" id="categoryRadio" v-model="selectedCategory">
        <label for="categoryRadio">{{category.label}}</label>
      </template>
    </div>
    <select v-model="selectedValue">
      <option v-for="val in categoryValues":value="val">{{val}}</option>
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
      wordForm: "",
      // TODO: these should be fetched when cateogry is changed
      categoryValues: ["apa", "bepa", "cepa"],
      selectedCategory: "bklass",
      selectedValue: "apa",
      // TODO: these are lexicon specific
      categories: [
        {
          "name": "bklass",
          "label": "bklass"
        },
        {
          "name": "fmparadigm",
          "label": "fmparadigm"
        }
      ]
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
