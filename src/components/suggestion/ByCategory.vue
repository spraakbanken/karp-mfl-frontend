<template>
  <div class="col-6">
    <div class="row">
      <div class="col">
        <input v-autofocus="true" type="text" :placeholder="loc('give_wordform')" v-model="wordForm">
      </div>
    </div>
    <div class="row">
      <div class="col">
        <b-form-radio-group v-model="selectedCategory">
          <b-form-radio value="paradigm">{{loc('paradigm')}}</b-form-radio>
          <b-form-radio v-for="category in categories" v-bind:key="category" :value="category">{{loc(category)}}</b-form-radio>
        </b-form-radio-group>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <CategorySelector v-model="selectedValue" :category="selectedCategory" :globals="globals" @router="update"/>
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
import CategorySelector from '@/components/helpers/CategorySelector'

export default {
  mixins: [mix],
  name: 'ByCategory',
  components: {
    CategorySelector
  },
  data () {
    return {
      wordForm: '',
      selectedCategory: 'paradigm',
      selectedValue: ''
    }
  },
  computed: {
    categories () {
      return _.keys(this.globals.hot.lexiconInfo.inflectionalclass)
    }
  },
  methods: {
    async giveSuggestion () {
      const entryInfo = {
        newEntry: true,
        promise: backend.inflectClass(this.globals.hot.lexicon, this.wordForm, this.selectedCategory, this.selectedValue)
      }
      EventBus.$emit('inflectionResultEvent', entryInfo)
    }
  },
  props: ['pos-tags']
}
</script>

<style scoped>

</style>
