<template>
  <div>
    <template v-if="showParadigm">
      <div class="row" v-for="row in transformSet">
        <div class="col-3">
          {{row.GrammaticalFeatures.msd}}
        </div>
        <div class="col3">
          {{prettyPrint(row.Process)}}
        </div>
      </div>
      
      <hr />
      
      <div class="row">
        <div class="col-3">
          {{loc('paradigm')}}
        </div>
        <div class="col-3">
          {{this.paradigm}}
        </div>
      </div>

      <div class="row" v-for="(classValues, className) in classes">
        <div class="col-3">
          {{loc(className)}}
        </div>
        <div class="col-3">
          {{classValues.join(", ")}}
        </div>
      </div>

      <div class="row">
        <div class="col-3">
          {{loc('entries')}}
        </div>
        <div class="col-3">
          {{this.entries}}
        </div>
      </div>

      <div class="row">
        <div class="col-3">
          {{loc('variable_instances')}}
        </div>
        <div class="col-auto">
          
          <div class="row">
            <div class="col-5 header" v-for="field in variableInstancesFields">
              {{field}}
            </div>
            <div class="col-2 header">
              {{loc('identifier')}}
            </div>
          </div>
          
          <div class="row" v-for="row in variableInstancesRows">
            <div class="col-5" v-for="field in variableInstancesFields">
              {{row[field]}}
            </div>
            <div class="col-2 link" @click="gotoWord(row['first-attest'])">
              {{row['first-attest']}}
            </div>
          </div>

          <div class="row" v-if="entries > 5">
            <div class="col-auto">
              ...
            </div>
          </div>
        </div>
      </div>
    </template>
    <div v-else>
      <icon name="spinner" spin></icon>
    </div>
  </div>
</template>

<script>
import mix from '@/mix'
import backend from '@/services/backend'

export default {
  mixins: [mix],
  name: 'Word',
  data () {
    return {
      classes: [],
      transformSet: [],
      variableInstancesFields: [],
      variableInstancesRows: [],
      entries: ''
    }
  },
  computed: {
    paradigm () {
      return this.globals.hot.paradigm
    },
    showParadigm () {
      return !_.isEmpty(this.transformSet)
    }
  },
  created: async function () {
    const paradigm = await backend.paradigmInfo(this.globals.hot.lexicon, this.paradigm)
    this.classes = paradigm.TransformCategory
    this.transformSet = paradigm.TransformSet
    this.entries = paradigm._entries
    this.prettyPrintVariableInstances(paradigm.VariableInstances)
  },
  methods: {
    prettyPrint (processList) {
      const parts = _.map(processList, (operation) => {
        if (operation.processType == 'pextractAddVariable') {
          return operation.variableNum
        } else if (operation.processType == 'pextractAddConstant') {
          return JSON.stringify(operation.stringValue)
        }
      })
      return parts.join(' + ')
    },
    prettyPrintVariableInstances (variableInstances) {
      const fieldCount = _.reduce(variableInstances.slice(0, 5), (elem, max) => {
        const columns = _.keys(elem)
        if (columns > max)
          return columns
        else {
          return max
        }
      }, 0)

      this.variableInstancesFields = Array.from(Array(fieldCount), (e,i) => i + 1)
      this.variableInstancesRows = variableInstances.slice(0, 5)
    },
    gotoWord (identifier) {
      this.update('view', 'word')
      this.update('identifier', identifier)
    }
  }
}
</script>

<style scoped>
.header {
  font-weight: bold;
}
</style>