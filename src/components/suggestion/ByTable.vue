<template>
  <div class="col-6">
    <div class="row">
      <div class="col">
        <select v-model="partOfSpeech">
          <option v-for="posTag in posTags" :value="posTag">{{posTag}}</option>
        </select>
      </div>
    </div>

    <div class="row justify-content-around" v-for="(row, idx) in tableRows">
      <div clas="col-auto">
        <select v-model="row.msd">
          <option v-for="msdTag in availableMsdTags" :value="msdTag">{{msdTag}}</option>
        </select>
      </div>
      <div class="col-auto">
        <input type="text" v-model="row.writtenForm">
      </div>
      <div class="col-auto">
        <button v-if="tableRows.length > 1" @click="removeTableRow(idx)">-</button>
      </div>
    </div>

    <div class="row justify-content-end">
      <div class="col-auto">
        <button v-on:click="addTableRow()">+</button>
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
  name: 'ByTable',
  data () {
    return {
      tableRows: [{msd: '', writtenForm: ''}],
      partOfSpeech: this.posTags[0],
      availableMsdTags: []
    }
  },
  watch: {
    partOfSpeech: {
      immediate: true,
      handler: async function(val, oldVal) {
        this.availableMsdTags = await backend.defaultTable(this.globals.hot.lexicon, this.partOfSpeech)
      }
    }
  },
  methods: {
    async giveSuggestion () {
      const entryInfo = {
        newEntry: true,
        promise: backend.inflectTable(this.globals.hot.lexicon, this.tableRows, this.partOfSpeech)
      }
      EventBus.$emit('inflectionResultEvent', entryInfo)
    },
    addTableRow () {
      this.tableRows.push({msd: '', writtenForm: ''})
    },
    removeTableRow (idx) {
      this.tableRows.splice(idx, 1)
    }
  },
  props: ['pos-tags']
}
</script>

<style scoped>

</style>
