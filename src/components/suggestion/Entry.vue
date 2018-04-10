<template>
  <div v-if="showResult">
    <div v-for="(table, index) in inflectionTables" v-if="index == currentPage">
      <div v-bind:style="inflectionTableClass">
        <table>
          <tr v-for="row in table.WordForms">
            <td><EditText v-model="row.msd" @tableEdit="tableEdited()"/></td>
            <td><EditText v-model="row.writtenForm" @tableEdit="tableEdited()"/></td>
          </tr>
        </table>
      </div>
      <hr/>
      <table>
        <tr>
          <td>{{loc(globals.hot.lexiconInfo.identifier)}}</td>
          <td>
            <input type="text" v-bind:class="{ errorInput: identifierError }" v-model="table.identifier" placeholder="..." @blur="blurIdentifier()"></input>
          </td>
          <td>
            <span class="errorText" v-show="identifierError">{{loc('mandatory')}}</span>
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
    <button @click="updateParadigm()" :disabled="!shouldUpdate">{{loc('update')}}</button>
    <button @click="saveToKarp()" :disabled="shouldUpdate">{{loc('save')}}</button>
  </div>
</template>

<script>
import Vue from 'vue'
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
      identifierError: false,
      shouldUpdates: []
    }
  },
  computed: {
    shouldUpdate () {
      return this.shouldUpdates[this.currentPage]
    },
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
    blurIdentifier () {
      if(this.inflectionTables[this.currentPage].identifier.length > 0) {
        this.identifierError = false
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
      if(!selectedTable.identifier) {
        this.identifierError = true
      } else {
        const lexicon = this.globals.hot.lexicon
        const table = selectedTable.WordForms
        const partOfSpeech = selectedTable.partOfSpeech
        const paradigm = selectedTable.paradigm
        const identifier = selectedTable.identifier
        const newParadigm = selectedTable.new
        // const class = selectedTable.classes // TODO: add fields for the classes in the corpus
        const resultParadigm = await backend.addTable(lexicon, table, partOfSpeech, paradigm, identifier, newParadigm)
        console.log("paradigm", resultParadigm)
        this.inflectionTables = [selectedTable]
      }
    },
    updateParadigm: async function () {
      const selectedTable = this.inflectionTables[this.currentPage]
      const userIdentifier = selectedTable.identifier
      const lexicon = this.globals.hot.lexicon
      const table = selectedTable.WordForms
      const pos = selectedTable.partOfSpeech
      const result = await backend.inflectTable(lexicon, table, pos)
      this.inflectionTables = result.Results
      _.map(this.inflectionTables, (table) => table.identifier = userIdentifier)
      this.currentPage = 0
      this.shouldUpdates.splice(this.inflectionTables.length)
      _.map(this.inflectionTables, (table, idx) => Vue.set(this.shouldUpdates, idx, false))
    },
    tableEdited () {
      Vue.set(this.shouldUpdates, this.currentPage, true)
    }
  },
  created: function () {
    console.log("## created")
    const initData = function (obj) {
      return function (viewData) {
        const newEntry = viewData.newEntry
        const candidate = viewData.candidate
        const identifier = viewData.identifier
        const promise = viewData.promise
        promise.then((result) => {
          console.log(obj)
          console.log("##", result.Results)
          obj.inflectionTables.splice(result.Results.length)
          _.map(result.Results, (result, idx) => Vue.set(obj.inflectionTables, idx, result))
          obj.currentPage = 0
          obj.shouldUpdates.splice(obj.inflectionTables.length)
          _.map(obj.inflectionTables, (table, idx) => Vue.set(obj.shouldUpdates, idx, false))
        })
      }
    }
    EventBus.$on('inflectionResultEvent', initData(this))
  },
  beforeDestroy(){
    console.log("## destroyed")
    EventBus.$off('inflectionResultEvent')
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
