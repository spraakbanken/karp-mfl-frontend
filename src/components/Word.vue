<template>
  <div>
    <InflectionTable
      v-if="showTable"
      :inflection-table="table"
      :identifier-error="false"
      :should-update="false"
      :classes="classes"
      :globals="globals" @router="update"
      :korpCount="{}"
      @tableEdited="tableEdited()"
      @classesEdited="classesEdited()"
      :readOnlyId="true"/>
    <div v-else>
      <icon name="spinner" spin></icon>
    </div>

    <div class="row mb-1 justify-content-end">
      <div class="col-auto">
        <button class="btn btn-primary" @click="saveToKarp()" :disabled="!needSave">{{loc('save')}}</button>
      </div>
    </div>

  </div>
</template>

<script>
import mix from '@/mix'
import InflectionTable from '@/components/InflectionTable'
import backend from '@/services/backend'
import Vue from 'vue'

export default {
  mixins: [mix],
  name: 'Word',
  components: {
    InflectionTable
  },
  data () {
    return {
      table: {},
      classes: [],
      firstParadigm: '',
      firstClasses: [],
      paradigmChanged: false,
      classesChanged: false
    }
  },
  computed: {
    paradigm () {
      return this.table.paradigm
    },
    identifier () {
      return this.globals.hot.identifier
    },
    showTable () {
      return !_.isEmpty(this.table)
    },
    needSave () {
      return this.paradigmChanged || this.classesChanged
    }
  },
  created: async function () {
    this.initData(await backend.wordInfo(this.globals.hot.lexicon, this.identifier))
  },
  methods: {
    initData (table) {
      this.table = table
      this.firstParadigm = this.table.paradigm
      for (const className of _.keys(this.globals.hot.lexiconInfo.inflectionalclass)) {
        Vue.set(this.classes, this.classes.length, {name: className, value: this.table[className]})
        Vue.set(this.firstClasses, this.firstClasses.length, {name: className, value: this.table[className]})
      }
    },
    tableEdited: async function () {
      const selectedTable = this.table
      const userIdentifier = selectedTable.identifier
      const lexicon = this.globals.hot.lexicon
      const table = selectedTable.WordForms
      const pos = selectedTable.partOfSpeech
      const resultPromise = backend.inflectTable(lexicon, table, pos, {strict: true})
      const vm = this
      Vue.nextTick(function () {
        resultPromise.then(function(result) {
          vm.table = result.Results[0]
          vm.paradigmChanged = vm.firstParadigm !== vm.paradigm
        })
      })
    },
    classesEdited () {
      let equal = true
      for( const {name: name1, value: value1} of this.firstClasses) {
        for( const {name: name2, value: value2} of this.classes) {
          if(value1 !== value2) {
            equal = false
          }
        }
      }
      this.classesChanged = !equal
    },
    saveToKarp: async function () {
      const lexicon = this.globals.hot.lexicon
      const table = this.table.WordForms
      const partOfSpeech = this.table.partOfSpeech
      const paradigm = this.paradigm
      const identifier = this.table.identifier
      const newParadigm = this.table.new
      this.paradigmChanged = false
      this.classesChanged = false
      this.initData(await backend.updateTable(lexicon, table, partOfSpeech, paradigm, identifier, newParadigm, this.classes))
    }
  }
}
</script>

<style scoped>

</style>
