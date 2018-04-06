<template>
  <div v-if="showResult">
    <div v-for="(table, index) in inflectionTables" v-if="index == currentPage">
      <div v-bind:style="inflectionTableClass">
        <table>
          <tr v-for="row in table.WordForms">
            <td><EditText v-model="row.msd" /></td>
            <td><EditText v-model="row.writtenForm" /></td>
          </tr>
        </table>
      </div>
      <hr/>
      <table>
        <tr>
          <td>lemgram</td>
          <td>
            <input type="text" v-bind:class="{ errorInput: lemgramError }" v-model="table.lemgram" placeholder="..." @blur="blurLemgram()"></input>
          </td>
          <td>
            <span class="errorText" v-show="lemgramError">{{loc('mandatory')}}</span>
          </td>
        </tr>
        <tr>
          <td>paradigm</td>
          <td>{{table.paradigm}} ({{table.new ? loc('new_paradigm') : table.count }})</td>
        </tr>
        <tr>
          <td>part of speech</td>
          <td>{{table.partOfSpeech}}</td>
        </tr>
      </table>
    </div>
    <hr />
    <button @click="gotoPrevPage" v-if="currentPage > 0"><-</button>
    <span>{{loc('page')}} {{currentPage + 1}} {{loc('of')}} {{numResults}}</span>
    <button @click="gotoNextPage" v-if="currentPage < (numResults - 1)">-></button>
    <hr />
    <button @click="updateParadigm()">{{loc('update')}}</button>
    <button @click="saveToKarp()">{{loc('save')}}</button>
  </div>
</template>

<script>
import mix from '@/mix'
import { EventBus } from '@/services/event-bus.js'
import EditText from '@/components/helpers/EditText'
import backend from '@/services/backend'

export default {
  mixins: [mix],
  name: 'Entry',
  components: {
    EditText
  },
  data () {
    return {
      currentPage: 0,
      inflectionTables: [],
      lemgramError: false
    }
  },
  computed: {
    showResult () {
      return this.inflectionTables.length > 0
    },
    numResults () {
      return this.inflectionTables.length
    },
    inflectionTableClass () {
      const numElems = _.reduce(this.inflectionTables, (acc, table) => {
        const l = table.WordForms.length
          if(l > acc) {
            return l
          } else { 
            return acc 
          } 
        }, -1)
      if(numElems > 14) {
        return {
          height: 14 * 27 + 'px',
          'overflow-y': 'scroll',
          'overflow-x': 'hidden'
        }
      } else {
        return {
          height: numElems * 27 + 'px'
        }
      }
    }
  },
  methods: {
    blurLemgram () {
      if(this.inflectionTables[this.currentPage].lemgram.length > 0) {
        this.lemgramError = false
      }
    },
    gotoPrevPage () {
      this.currentPage -= 1
    },
    gotoNextPage () {
      this.currentPage += 1
    },
    saveToKarp: async function () {
      const selectedTable = this.inflectionTables[this.currentPage]
      if(!selectedTable.lemgram) {
        this.lemgramError = true
      } else {
        const lexicon = this.globals.hot.lexicon
        const table = selectedTable.WordForms
        const partOfSpeech = selectedTable.partOfSpeech
        const paradigm = selectedTable.paradigm
        const identifier = selectedTable.lemgram
        const newParadigm = selectedTable.new
        // const class = selectedTable.classes // TODO: add fields for the classes in the corpus
        const resultParadigm = await backend.addTable(lexicon, table, partOfSpeech, paradigm, identifier, newParadigm)
        console.log("paradigm", resultParadigm)
        this.inflectionTables = [selectedTable]
      }
    },
    updateParadigm: async function () {
      const selectedTable = this.inflectionTables[this.currentPage]
      const userLemgram = selectedTable.lemgram
      const lexicon = this.globals.hot.lexicon
      const table = selectedTable.WordForms
      const pos = selectedTable.partOfSpeech
      const result = await backend.inflectTable(lexicon, table, pos)
      if(!_.isArray(result.Results)) {
        this.inflectionTables = [result.Results]
      } else {
        this.inflectionTables = result.Results
      }
      _.map(this.inflectionTables, (table) => table.lemgram = userLemgram)
      this.currentPage = 0
    }
  },
  mounted: function () {
    const setResult = function (obj) {
      return function (result) {
        // TODO solve this in backend.js or in real-backend
        if(!_.isArray(result.Results)) {
          obj.inflectionTables = [result.Results]
        } else {
          obj.inflectionTables = result.Results
        }
        obj.currentPage = 0
      }
    }
    // TODO: det är förmodligen dåligt att skicka stora mängder data via eventbussen??
    EventBus.$on('inflectionResultEvent', setResult(this))
  }
}
</script>

<style scoped>
div {
  margin-top: 50px;
}
table {
  margin: auto;
}
.errorText {
  color: red;
}
.errorInput {
  border: 1px solid red;
}
</style>
