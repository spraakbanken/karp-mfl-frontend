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
        <!-- TODO: restore count -->
        <OfflineTypeahead :dataset="tempCategoryValues" v-model="selectedValue" :placeholder="loc('choose_value')" any-val="true" />
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
  name: 'ByCategory',
  components: {
    OfflineTypeahead
  },
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
      return _.keys(this.globals.hot.lexiconInfo.inflectionalclass)
    },
    tempCategoryValues () {
      return _.map(this.categoryValues, (elem) => elem[0])
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
