<template>
  <div>
    <div class="row justify-content-around">
      <div v-bind:style="inflectionTableClass" class="col-5">
        <div :style="gridStyle" class="mr-1 inflection-row" v-for="(row, idx) in inflectionTable.WordForms">

          <div class="remove-button" @click="removeTableRow(idx)"><icon class="remove-icon" name="minus-circle"></icon></div>

          <MsdChooser @tableEdit="tableEdited()" :dataset="msdValues" v-model="row.msd" :globals="globals" @router="update" />

          <div :class="{ 'show-false' : showFalse(row) }">
            <EditText v-model="row.writtenForm" @tableEdit="tableEdited()"/>
          </div>

          <div v-if="globals.hot.lexiconInfo.hasShow">
            <input type="checkbox" v-model="row.show" @change="tableEdited()" />
          </div>

          <template v-if="row.msd && row.writtenForm">
            
            <div>
              {{korpCount[row.writtenForm]}}
            </div>
            
            <div>
              <a :href="korpLinks[idx]" target="_blank">
                <img class="korp-thumb" src="../assets/korp.png" />
              </a>
            </div>

          </template>
        </div>
        <div class="row justify-content-center">
          <div class="col-auto">
            <div class="add-button" @click="addTableRow()"><icon name="plus-circle"></icon></div>
          </div>
        </div>
      </div>

      <div class="col-5 border rounded pt-2 pb-2" style="height: 100%">
        <div class="row justify-content-center mb-2">
          <div class="col-auto">
            <a class="btn btn-primary btn-sm" :href="korpLinkAll" target="_blank">
              <img class="korp-thumb" src="../assets/korp.png" /> {{loc('show_all_word_forms')}}
            </a>
          </div>
        </div>
        <div class="row">
          <div class="col-4">{{loc(globals.hot.lexiconInfo.identifier)}}</div>
          <div class="col">
            <span v-if="readOnlyId">{{inflectionTable.identifier}}</span>
            <input v-else type="text" v-bind:class="{ 'error-input': hasIdentifierError }" v-model="inflectionTable.identifier" placeholder="..." @blur="blurIdentifier()"></input>
            <span class="error-text" v-show="identifierEmpty">{{loc('mandatory')}}</span>
            <span class="error-text" v-show="identifierNotUnique">{{loc('not_unique')}}</span>
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
            <CategorySelector v-model="inflectionClass.value" @input="classesEdited()" :category="inflectionClass.name" :globals="globals" @router="update"/>
          </div>
        </div>
      </div>
    </div>
    <hr/>
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
import MsdChooser from '@/components/helpers/MsdChooser'
import Paradigm from '@/components/Paradigm'
import backend from '@/services/backend'
import korp from '@/services/korp'

export default {
  mixins: [mix],
  name: 'InflectionTable',
  components: {
    EditText,
    CategorySelector,
    Paradigm,
    MsdChooser
  },
  props: ['inflectionTable','maxRows','identifierError','shouldUpdate','classes', 'korpCount', 'readOnlyId'],
  data () {
    return {
      paradigmModalOpen: false,
      msdValues: []
    }
  },
  computed: {
    gridStyle () {
      const style = {
        'display': 'grid',
        'grid-gap': '10px'
      }
      if(this.globals.hot.lexiconInfo.hasShow) {
        style['grid-template-columns'] = '1fr 10fr 8fr 1fr 1fr 1fr'
      } else {
        style['grid-template-columns'] = '1fr 10fr 8fr 1fr 1fr'
      }
      return style
    },
    hasIdentifierError () {
      return this.identifierError.length > 0
    },
    identifierEmpty () {
      return this.identifierError === 'empty'
    },
    identifierNotUnique () {
      return this.identifierError === 'not_unique'
    },
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
      Vue.set(ref, ref.length, {msd: '', writtenForm: ''})
      this.tableEdited()
    },
    removeTableRow (rowIdx) {
      const ref = this.inflectionTable.WordForms
      ref.splice(rowIdx, 1)
      this.tableEdited()
    },
    blurIdentifier () {
      if(this.identifierError === 'empty' && this.inflectionTable.identifier.length > 0) {
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
    },
    showFalse (row) {
      if (this.globals.hot.lexiconInfo.hasShow) {
        return !row.show
      } else {
        return false
      }
    }
  },
  created: async function () {
    this.msdValues = await backend.defaultTable(this.globals.hot.lexicon, this.inflectionTable.partOfSpeech)
  }
}
</script>

<style scoped>
.error-text {
  color: red;
}
.error-input {
  border: 1px solid red;
}
.unknown-paradigm {
  font-style: italic;
}
.show-false {
  font-style: italic;
  color: grey;
}
.korp-thumb {
  width: 18px;
  height: 20px;
}
.add-button {
  cursor: pointer;
}
.inflection-row:hover .remove-button {
  color: black;
}
.remove-button {
  color: white;
  cursor: pointer;
}
.remove-icon {
  vertical-align: text-top;
}
</style>
