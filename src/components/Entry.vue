<template>
  <div>
    <div v-if="showResult">
      <div v-for="(table, index) in inflectionTables" v-if="index == currentPage">
        <InflectionTable
          :inflection-table="table"
          :max-rows="maxRows"
          :identifier-error="identifierError"
          :should-update="shouldUpdates[index]"
          :classes="classes"
          :korp-count="korpCount"
          @tableEdited="tableEdited()"
          @errorsResolved="identifierError = ''"
          :globals="globals" @router="update" />
      </div>

      <div class="row justify-content-center mt-3">
        <div class="col-auto">
          <Pager v-model="currentPage" :pageCount="numResults" :keys="paradigmKeys" :globals="globals" @router="update"/>
        </div>
      </div>

      <hr />
      <div class="row justify-content-end mb-2">
        <div class="col-auto">
          <button class="btn btn-outline-primary" @click="updateParadigm()" :disabled="!shouldUpdate">{{loc('update')}}</button>
          <button class="btn btn-primary" @click="saveToKarp()" :disabled="shouldUpdate">{{loc('save')}}</button>
        </div>
      </div>
    </div>
    <div v-if="emptyResult">
      {{loc('no_results')}}
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import mix from '@/mix'
import { EventBus } from '@/services/event-bus.js'
import Pager from '@/components/helpers/Pager'
import InflectionTable from '@/components/InflectionTable'
import backend from '@/services/backend'

export default {
  mixins: [mix],
  name: 'Entry',
  components: {
    Pager,
    InflectionTable
  },
  data () {
    return {
      currentPage: 0,
      inflectionTables: [],
      shouldUpdates: [],
      callback: '',
      candidate: {},
      identifierError: '',
      korpCount: {},
      emptyResult: false
    }
  },
  watch: {
    wordForms: {
      immediate: true,
      handler: _.debounce(async function () {
        const promises = {}
        for (const wf of this.wordForms) {
          if(this.korpCount[wf] === undefined) {
            promises[wf] = backend.countOccurrences(this.globals.hot.lexicon, wf)
          }
        }
        for (const wf of _.keys(promises)) {
          const res = await promises[wf]
          Vue.set(this.korpCount, wf, res)
        }
      }, 500),
    }
  },
  computed: {
    wordForms () {
      if(this.inflectionTables.length > 0) {
        return _.map(this.inflectionTables[this.currentPage].WordForms, (wf) => {
          return wf.writtenForm
        })
      } else {
        return []
      }
    },
    classes () {
      return _.map(_.keys(this.globals.hot.lexiconInfo.inflectionalclass), (cat) => {
        return {
          name: cat,
          value: ''
        }
      })
    },
    shouldUpdate () {
      return this.shouldUpdates[this.currentPage]
    },
    showResult () {
      return this.inflectionTables.length > 0
    },
    numResults () {
      return this.inflectionTables.length
    },
    maxRows () {
      return _.reduce(this.inflectionTables, (acc, table) => {
        const l = table.WordForms.length
        if(l > acc) {
          return l
        } else { 
          return acc 
        } 
      }, -1)
    },
    paradigmKeys () {
      return _.map(this.inflectionTables, (table) => {
        return table.paradigm
      })
    }
  },
  methods: {
    saveToKarp: async function () {
      const selectedTable = this.inflectionTables[this.currentPage]
      if(!selectedTable.identifier) {
        this.identifierError = 'empty'
      } else {
        const lexicon = this.globals.hot.lexicon
        const table = selectedTable.WordForms
        const partOfSpeech = selectedTable.partOfSpeech
        const paradigm = selectedTable.paradigm
        const identifier = selectedTable.identifier
        const newParadigm = selectedTable.new
        const resultParadigm = await backend.addTable(lexicon, table, partOfSpeech, paradigm, identifier, newParadigm, this.classes)
        if (resultParadigm.code === 'unique_lemgram') {
          this.identifierError = 'not_unique'
        } else {
          if (!_.isEmpty(this.candidate)) {
              backend.removeCandidate(lexicon, this.candidate.identifier)
              delete this.candidate['identifier']
          }

          // TODO: this doesn't look nice and also it will not work if backend is slow
          const vm = this
          _.delay(async function () {
            vm.update([{param: 'view', value: 'word'}, {param: 'identifier', value: resultParadigm.identifier}])
          }, 2000)

          this.inflectionTables = []
        }
      }
    },
    updateParadigm: async function () {
      const selectedTable = this.inflectionTables[this.currentPage]
      const userIdentifier = selectedTable.identifier
      const lexicon = this.globals.hot.lexicon
      const table = selectedTable.WordForms
      const pos = selectedTable.partOfSpeech
      
      this.inflectionTables = []
      this.currentPage = 0
      
      const vm = this
      Vue.nextTick(function () {
        backend.inflectTable(lexicon, table, pos, {strict: true}).then((result) => {
          vm.inflectionTables = result.Results
          _.map(vm.inflectionTables, (table) => table.identifier = userIdentifier)
          vm.shouldUpdates.splice(vm.inflectionTables.length)
          _.map(vm.inflectionTables, (table, idx) => Vue.set(vm.shouldUpdates, idx, false))
          vm.currentPage = 0
        })
      })
    },
    tableEdited () {
      Vue.set(this.shouldUpdates, this.currentPage, true)
    }
  },
  created: function () {
    const initData = function (obj) {
      return function (viewData) {
        const newEntry = viewData.newEntry
        
        if(viewData.candidate) {
          obj.candidate.identifier = viewData.identifier
        }
        const promise = viewData.promise
        promise.then((result) => {
          obj.inflectionTables.splice(result.Results.length)
          if (result.Results.length > 0) {
            _.map(result.Results, (result, idx) => Vue.set(obj.inflectionTables, idx, result))
            obj.currentPage = 0
            obj.shouldUpdates.splice(obj.inflectionTables.length)
            _.map(obj.inflectionTables, (table, idx) => Vue.set(obj.shouldUpdates, idx, false))
            obj.korpCount = {}
            obj.emptyResult = false
          } else {
            obj.emptyResult = true
          }
        })
      }
    }
    this.callback = initData(this)
    EventBus.$on('inflectionResultEvent', this.callback)
    this.$emit('readyEvent')
  },
  beforeDestroy(){
    EventBus.$off('inflectionResultEvent', this.callback)
  }
}
</script>

<style scoped>

</style>
