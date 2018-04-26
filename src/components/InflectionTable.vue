<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-4"></div>
      <div v-bind:style="inflectionTableClass" class="col-auto">
        <table class="mr-5">
          <tr v-for="(row, idx) in inflectionTable.WordForms">
            <td><EditText v-model="row.msd" @tableEdit="tableEdited()"/></td>
            <td :class="{ italic : !row.show }">
              <EditText v-model="row.writtenForm" @tableEdit="tableEdited()"/>
            </td>
            <td>
              {{korpCount[row.writtenForm]}}
            </td>
            <td>
              <a :href="korpLinks[idx]" target="_blank">
                <img class="korp-thumb" src="../assets/korp.png" />
              </a>
            </td>
          </tr>
        </table>
      </div>
      
      <div class="col-auto ml-auto">
        <a class="btn btn-primary btn-sm" :href="korpLinkAll" target="_blank">
          <img class="korp-thumb" src="../assets/korp.png" /> {{loc('show_all_word_forms')}}
        </a>
      </div>
    </div>
    <div class="tmp" @click="addTableRow()"><icon name="plus-circle"></icon></div>
    <hr/>
    <div class="row justify-content-center">
      <div class="col-auto">
        <div class="row">
          <div class="col-4">{{loc(globals.hot.lexiconInfo.identifier)}}</div>
          <div class="col">
            <span v-if="readOnlyId">{{inflectionTable.identifier}}</span>
            <input v-else type="text" v-bind:class="{ errorInput: identifierError }" v-model="inflectionTable.identifier" placeholder="..." @blur="blurIdentifier()"></input>
          </div>
          <div class="col-3">
            <span class="errorText" v-show="identifierError">{{loc('mandatory')}}</span>
          </div>
        </div>
        <div class="row">
          <div class="col-4">paradigm</div>
          <div class="col" v-if="inflectionTable.new && !shouldUpdate">
            <EditText v-model="inflectionTable.paradigm" />
            ({{loc('new_paradigm')}})
            <span @click="viewParadigm"><icon name="eye"></icon></span>
          </div>
          <div class="col" v-else-if="!shouldUpdate">
            {{inflectionTable.paradigm}} ({{ inflectionTable.count }})
            <span @click="viewParadigm"><icon name="eye"></icon></span>
          </div>
          <div v-else class="col unknown-paradigm">
            {{loc('unknown_paradigm')}}
          </div>
        </div>
        <div class="row">
          <div class="col-4">{{loc('part_of_speech')}}</div>
          <div class="col">{{inflectionTable.partOfSpeech}}</div>
        </div>
        <div class="row">
          <div class="col-4">{{loc('variables')}}</div>
          <div class="col-auto">
            <div class="row" v-for="varValue, variable in inflectionTable.variables">
              <span class="col-auto">{{variable}}: {{varValue}}</span>
            </div>
          </div>
        </div>
        <div class="row" v-for="inflectionClass in classes">
          <div class="col-4">{{loc(inflectionClass.name)}}</div>
          <div v-if="inflectionClass.value" class="col">
            <EditText v-model="inflectionClass.value" @tableEdit="classesEdited()" />
          </div>
          <div v-else class="col">
            <CategorySelector v-model="inflectionClass.value" :category="inflectionClass.name" :globals="globals" @router="update"/>
          </div>
        </div>
      </div>
    </div>

    <template v-if="paradigmModalOpen">
      <b-modal size="lg" :title="loc('paradigm')" v-model="paradigmModalOpen">
        <Paradigm :paradigmIdentifier="inflectionTable.paradigm" :paradigmData="inflectionTable.pattern" :globals="globals" @router="update"></Paradigm>
        <div slot="modal-footer"></div>
      </b-modal>
    </template>

  </div>
</template>

<script>
import Vue from 'vue'
import mix from '@/mix'
import EditText from '@/components/helpers/EditText'
import CategorySelector from '@/components/helpers/CategorySelector'
import Paradigm from '@/components/Paradigm'
import backend from '@/services/backend'
import korp from '@/services/korp'

export default {
  mixins: [mix],
  name: 'InflectionTable',
  components: {
    EditText,
    CategorySelector,
    Paradigm
  },
  props: ['inflectionTable','maxRows','identifierError','shouldUpdate','classes', 'korpCount', 'readOnlyId'],
  data () {
    return {
      paradigmModalOpen: false
    }
  },
  computed: {
    korpLinks () {
      return _.map(this.inflectionTable.WordForms, (word) => {
        return korp.createKorpLink([word.writtenForm], this.globals.hot.lexiconInfo.corpora)
      })
    },
    korpLinkAll () {
      const wordForms = _.map(this.inflectionTable.WordForms, 'writtenForm')
      return korp.createKorpLink(wordForms, this.globals.hot.lexiconInfo.corpora)
    },
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
    },
    classesEdited () {
      this.$emit('classesEdited')
    },
    viewParadigm () {
      this.paradigmModalOpen = true
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
.korp-thumb {
  width: 18px;
  height: 20px;
}
</style>
