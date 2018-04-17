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
      <div class="tmp" @click="addTableRow()"><icon name="plus-circle"></icon></div>
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
          <td v-if="table.new && !shouldUpdates[index]">
            <EditText v-model="table.paradigm" />
            ({{loc('new_paradigm')}})
          </td>
          <td v-else-if="!shouldUpdates[index]">
            {{table.paradigm}} ({{ table.count }})
          </td>
          <td v-else class="unknown-paradigm">
            {{loc('unknown_paradigm')}}
          </td>
        </tr>
        <tr>
          <td>{{loc('part_of_speech')}}</td>
          <td>{{table.partOfSpeech}}</td>
        </tr>
        <tr>
          <td>{{loc('variables')}}</td>
          <td>
            <template v-for="variable, varValue in table.variables">
              <span>{{variable}}: {{varValue}}</span>
            </template>
          </td>
        </tr>
        <tr v-for="inflectionClass in classes">
          <td>{{loc(inflectionClass.name)}}</td>
          <td><CategorySelector v-model="inflectionClass.value" :category="inflectionClass.name" :globals="globals" @router="update"/></td>
        </tr>
      </table>
    </div>
    <hr />
    <button @click="gotoPrevPage" v-if="currentPage > 0"><-</button>
    <span>{{loc('page')}} {{currentPage + 1}} {{loc('of')}} {{numResults}}</span>
    <button @click="gotoNextPage" v-if="currentPage < (numResults - 1)">-></button>
    <hr />
    <button class="btn btn-outline-primary" @click="updateParadigm()" :disabled="!shouldUpdate">{{loc('update')}}</button>
    <button class="btn btn-primary" @click="saveToKarp()" :disabled="shouldUpdate">{{loc('save')}}</button>
  </div>
</template>

<script>
import Vue from 'vue'
import mix from '@/mix'
import { EventBus } from '@/services/event-bus.js'
import EditText from '@/components/helpers/EditText'
import CategorySelector from '@/components/helpers/CategorySelector'
import backend from '@/services/backend'

export default {
  mixins: [mix],
  name: 'Entry',
  components: {
    EditText,
    CategorySelector
  },
  data () {
    return {
      currentPage: 0,
      inflectionTables: [],
      identifierError: false,
      shouldUpdates: [],
      callback: '',
      candidate: {},
      classes: []
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
    addTableRow () {
      const ref = this.inflectionTables[this.currentPage].WordForms
      Vue.set(ref, ref.length, {msd: 'Mata in MSD', writtenForm: 'Mata in ordform'})
      this.tableEdited()
    },
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
        const resultParadigm = await backend.addTable(lexicon, table, partOfSpeech, paradigm, identifier, newParadigm, this.classes)
        console.log("paradigm", resultParadigm)
        this.inflectionTables = [selectedTable]
        
        if (!_.isEmpty(this.candidate)) {
            backend.removeCandidate(lexicon, this.candidate.identifier)
            delete this.candidate['identifier']
        }
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
    this.classes = _.map(_.keys(this.globals.hot.lexiconInfo.inflectionalclass), (cat) => {
      return {
        name: cat,
        value: ''
      }
    })

    const initData = function (obj) {
      return function (viewData) {
        const newEntry = viewData.newEntry
        
        if(viewData.candidate) {
          obj.candidate.identifier = viewData.identifier
        }
        const promise = viewData.promise
        promise.then((result) => {
          obj.inflectionTables.splice(result.Results.length)
          _.map(result.Results, (result, idx) => Vue.set(obj.inflectionTables, idx, result))
          obj.currentPage = 0
          obj.shouldUpdates.splice(obj.inflectionTables.length)
          _.map(obj.inflectionTables, (table, idx) => Vue.set(obj.shouldUpdates, idx, false))
        })
      }
    }
    this.callback = initData(this)
    EventBus.$on('inflectionResultEvent', this.callback)
  },
  beforeDestroy(){
    EventBus.$off('inflectionResultEvent', this.callback)
  }
}
</script>

<style scoped>
table {
  margin: auto;
}
.errorText {
  color: red;
}
.errorInput {
  border: 1px solid red;
}
.unknown-paradigm {
  font-style: italic;
}
.tmp {
  text-align: center;
}
</style>
