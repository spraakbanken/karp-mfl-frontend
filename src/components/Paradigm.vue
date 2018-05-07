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
          {{this.paradigmIdentifier}}
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
  name: 'Paradigm',
  props: ['paradigmIdentifier', 'paradigmData'],
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
    showParadigm () {
      return !_.isEmpty(this.transformSet)
    }
  },
  created: async function () {
    let paradigm = {}
    if(this.paradigmData) {
      paradigm = this.paradigmData
    } else {
      paradigm = await backend.paradigmInfo(this.globals.hot.lexicon, this.paradigmIdentifier)
    }
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
      // assume all identifiers belonging to this paradigm has the same number of variable instances
      const fieldCount = _.keys(variableInstances[0]).length - 1
      this.variableInstancesFields = Array.from(Array(fieldCount), (e,i) => i + 1)
      this.variableInstancesRows = variableInstances.slice(0, 5)
    },
    gotoWord (identifier) {
      this.$emit('wordClicked', identifier)
    }
  }
}
</script>

<style scoped>
.header {
  font-weight: bold;
}
</style>
