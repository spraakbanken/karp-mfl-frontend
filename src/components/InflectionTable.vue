<template>
  <div>
    <div v-bind:style="inflectionTableClass">
      <table>
        <tr v-for="row in inflectionTable.WordForms">
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
          <input type="text" v-bind:class="{ errorInput: identifierError }" v-model="inflectionTable.identifier" placeholder="..." @blur="blurIdentifier()"></input>
        </td>
        <td>
          <span class="errorText" v-show="identifierError">{{loc('mandatory')}}</span>
        </td>
      </tr>
      <tr>
        <td>paradigm</td>
        <td v-if="inflectionTable.new && !shouldUpdate">
          <EditText v-model="inflectionTable.paradigm" />
          ({{loc('new_paradigm')}})
        </td>
        <td v-else-if="!shouldUpdate">
          {{inflectionTable.paradigm}} ({{ inflectionTable.count }})
        </td>
        <td v-else class="unknown-paradigm">
          {{loc('unknown_paradigm')}}
        </td>
      </tr>
      <tr>
        <td>{{loc('part_of_speech')}}</td>
        <td>{{inflectionTable.partOfSpeech}}</td>
      </tr>
      <tr>
        <td>{{loc('variables')}}</td>
        <td>
          <template v-for="variable, varValue in inflectionTable.variables">
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
</template>

<script>
import Vue from 'vue'
import mix from '@/mix'
import EditText from '@/components/helpers/EditText'
import CategorySelector from '@/components/helpers/CategorySelector'

export default {
  mixins: [mix],
  name: 'InflectionTable',
  components: {
    EditText,
    CategorySelector
  },
  props: ['inflectionTable','maxRows','identifierError','shouldUpdate','classes'],
  data () {
    return {
    }
  },
  computed: {
    inflectionTableClass () {
      if(this.maxRows > 14) {
        return {
          height: 14 * 27 + 'px',
          'overflow-y': 'scroll',
          'overflow-x': 'hidden'
        }
      } else {
        return {
          height: this.maxRows * 27 + 'px'
        }
      }
    }
  },
  methods: {
    addTableRow () {
      const ref = this.inflectionTable.WordForms
      Vue.set(ref, ref.length, {msd: 'Mata in MSD', writtenForm: 'Mata in ordform'})
      this.tableEdited()
    },
    blurIdentifier () {
      if(this.identifierError && this.inflectionTable.identifier.length > 0) {
        this.$emit('errorsResolved')
      }
    },
    tableEdited () {
      this.$emit('tableEdited')
    }
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
