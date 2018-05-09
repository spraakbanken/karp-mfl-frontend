<template>
  <div class="col-9">
    <div class="row">
      <div class="col">
        <OfflineTypeahead :dataset="posTags" v-model="partOfSpeech" :placeholder="loc('choose_pos')" any-val="true" />
      </div>
    </div>

    <div class="row" v-if="showTable">
      <div class="col-3">
        MSD
      </div>
      <div class="col-auto">
        {{loc('word_form')}}
      </div>
    </div>
    <div class="row" v-for="(row, idx) in tableRows">
      <div class="col-3">
        <EditText v-model="row.msd" />
      </div>
      <div class="col-9">
        <input type="text" v-model="row.writtenForm">
        <span v-if="idx + 1 == tableRows.length" v-on:click="addTableRow()"><icon name="plus-circle"></icon></span>
        <span v-if="tableRows.length > 1" v-on:click="removeTableRow(idx)"><icon name="minus-circle"></icon></span>
        
        <span class="ml-3" v-if="idx === 0">
          <input id="restrictToBaseform" type="checkbox" v-model="restrictToBaseform"/>
          <label for="restrictToBaseform">{{loc('baseform')}}</label>
        </span>
      </div>
    </div>

    <div class="row">
      <div class="col error-text">
        {{this.errorText}}
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
import EditText from '@/components/helpers/EditText'

export default {
  mixins: [mix],
  name: 'ByTable',
  components: {
    OfflineTypeahead,
    EditText
  },
  data () {
    return {
      tableRows: [],
      partOfSpeech: this.posTags[0],
      errorText: '',
      showTable: false,
      restrictToBaseform: true
    }
  },
  watch: {
    partOfSpeech: {
      immediate: true,
      handler: async function(val, oldVal) {
        if (val) {
          const availableMsdTags = await backend.defaultTable(this.globals.hot.lexicon, this.partOfSpeech)
          this.tableRows = _.map(availableMsdTags, (msd) => {
            return {msd: msd, writtenForm: ''}
          })
          this.showTable = true
        } else {
          this.showTable = false
        }
      }
    }
  },
  methods: {
    canSearch () {
      if(_.isEmpty(this.partOfSpeech)) {
        return false
      }
      for (const { msd, writtenForm } of this.tableRows) {
        if(_.isEmpty(msd) || _.isEmpty(writtenForm)) {
          return false
        }
      }
      return true
    },
    async giveSuggestion () {
      if(this.canSearch()) {
        const entryInfo = {
          newEntry: true,
          promise: backend.inflectTable(this.globals.hot.lexicon, this.tableRows, this.partOfSpeech, {restrictToBaseform: this.restrictToBaseform})
        }
        EventBus.$emit('inflectionResultEvent', entryInfo)
        this.errorText = ''
      } else {
        // TODO: send message to entry to hide old results
        this.errorText = this.loc('empty_fields')
      }
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
.error-text {
  color: red;
}
</style>
