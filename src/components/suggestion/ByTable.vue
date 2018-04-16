<template>
  <div class="col-9">
    <div class="row">
      <div class="col">
        <OfflineTypeahead :dataset="posTags" v-model="partOfSpeech" :placeholder="loc('choose_pos')" any-val="true" />
      </div>
    </div>

    <div class="row">
      <div class="col-3">
        MSD
      </div>
      <div class="col-auto">
        {{loc('word_form')}}
      </div>
    </div>
    <div class="row" v-for="(row, idx) in tableRows">
      <div class="col-3">
        <select v-model="row.msd">
          <option v-for="msdTag in availableMsdTags" :value="msdTag">{{msdTag}}</option>
        </select>
      </div>
      <div class="col-9">
        <input type="text" v-model="row.writtenForm">
        <span v-if="idx + 1 == tableRows.length" v-on:click="addTableRow()"><icon name="plus-circle"></icon></span>
        <span v-if="tableRows.length > 1" v-on:click="removeTableRow(idx)"><icon name="minus-circle"></icon></span>
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
  name: 'ByTable',
  components: {
    OfflineTypeahead
  },
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
