<template>
  <div>
    <div v-bind:style="inflectionTableClass">
      <table>
        <tr v-for="row in inflectionTable.WordForms">
          <td><EditText v-model="row.msd" @tableEdit="tableEdited()"/></td>
          <td :class="{ italic : !row.show }"><EditText v-model="row.writtenForm" @tableEdit="tableEdited()"/></td>
        </tr>
      </table>
    </div>
    <div class="tmp" @click="addTableRow()"><icon name="plus-circle"></icon></div>
    <hr/>
    <div class="row justify-content-center">
      <div class="col-auto">
        <div class="row">
          <div class="col-3">{{loc(globals.hot.lexiconInfo.identifier)}}</div>
          <div class="col">
            <input type="text" v-bind:class="{ errorInput: identifierError }" v-model="inflectionTable.identifier" placeholder="..." @blur="blurIdentifier()"></input>
          </div>
          <div class="col-3">
            <span class="errorText" v-show="identifierError">{{loc('mandatory')}}</span>
          </div>
        </div>
        <div class="row">
          <div class="col-3">paradigm</div>
          <div class="col" v-if="inflectionTable.new && !shouldUpdate">
            <EditText v-model="inflectionTable.paradigm" />
            ({{loc('new_paradigm')}})
          </div>
          <div class="col" v-else-if="!shouldUpdate">
            {{inflectionTable.paradigm}} ({{ inflectionTable.count }})
          </div>
          <div v-else class="col unknown-paradigm">
            {{loc('unknown_paradigm')}}
          </div>
        </div>
        <div class="row">
          <div class="col-3">{{loc('part_of_speech')}}</div>
          <div class="col">{{inflectionTable.partOfSpeech}}</div>
        </div>
        <div class="row">
          <div class="col-3">{{loc('variables')}}</div>
          <div class="col-auto">
            <div class="row" v-for="varValue, variable in inflectionTable.variables">
              <span class="col-auto">{{variable}}: {{varValue}}</span>
            </div>
          </div>
        </div>
        <div class="row" v-for="inflectionClass in classes">
          <div class="col-3">{{loc(inflectionClass.name)}}</div>
          <div class="col"><CategorySelector v-model="inflectionClass.value" :category="inflectionClass.name" :globals="globals" @router="update"/></div>
        </div>
      </div>
    </div>
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
.italic {
  font-style: italic;
}
</style>
