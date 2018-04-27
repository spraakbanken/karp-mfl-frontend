<template>
  <div>
    <div>
      <button class="btn btn-primary" v-b-modal.addCandidatesModal>{{loc('add_candidates')}}</button>
      <button class="btn btn-danger" @click="recomputeCandidates">{{loc('recompute_candidates')}}</button>
      <span class="ml-1" v-if="updatedCandidates">{{loc('updated')}}: {{updatedCandidates}}</span>
      <b-modal id="addCandidatesModal" :title="loc('add_candidates')" size="lg" v-model="showCandidateUpload">
        <b-container fluid class="padding">
          <div class="row justify-content-start">
            <div class="col-auto">
              <input type="file" ref="fileUpload" style="display:none" @change="handleFile($event.target.files)">
              <button class="btn btn-primary" @click="openFileUpload()">{{loc('pick_files')}}</button>
            </div>
          </div>
          <div class="row justify-content-center">
            <div class="col">
              <!-- onkeydown explanation: this code inserts tab when user presses tab instead
                  of the default behavior, switching focus-->
              <textarea onkeydown="if(event.keyCode===9){var v=this.value,s=this.selectionStart,e=this.selectionEnd;this.value=v.substring(0, s)+'\t'+v.substring(e);this.selectionStart=this.selectionEnd=s+1;return false;}"
                        v-model="newCandidates" rows="20" cols="79"></textarea>
            </div>
          </div>
          <div class="row justify-content-end">
            <div class="col-auto">
              <button class="btn btn-primary" @click="addCandidates">{{loc('add_candidates')}}</button>
            </div>
          </div>
        </b-container>
        <div slot="modal-footer"></div>
      </b-modal>
    </div>
    
    <b-table class="mt-3 candidate-table" striped hover 
            :items="data"
            :fields="fields"
            @row-clicked="gotoCandidate"
            :sort-compare="sortTable">
    </b-table>

  </div>
</template>

<script>
import mix from '@/mix'
import backend from '@/services/backend'
import * as _ from 'lodash'
import Vue from 'vue'

export default {
  mixins: [mix],
  name: 'Candidates',
  data () {
    return {
      data: [],
      showCandidateUpload: false,
      newCandidates: '',
      updatedCandidates: '',
      fields: [
        {
          key: 'baseform',
          label: this.loc('baseform'),
          sortable: true
        },
        {
          key: 'paradigm',
          label: this.loc('paradigm'),
          sortable: true
        },
        {
          key: 'score',
          label: this.loc('score'),
          sortable: true
        }
      ]
    }
  },
  watch: {
    lexicon: {
      immediate: true,
      handler (newVal, oldVal) {
        this.getCandidateList()
      }
    }
  },
  computed: {
    lexicon () {
      return this.globals.hot.lexicon
    }
  },
  methods: {
    openFileUpload () {
      this.$refs.fileUpload.click()
    },
    handleFile (files) {
      const obj = this
      if (files.length > 0) {
        const f = files[0]
        const reader = new FileReader()
        reader.onload = (function(theFile) {
          return function(e) {
            obj.newCandidates = e.target.result
          }
        })(f)
        reader.readAsText(f)
      }
    },
    getCandidateList: async function () {
      this.data = await backend.getCandidateList(this.globals.hot.lexicon)
    },
    gotoCandidate: async function (item, index) {
      const entryInfo = {
        candidate: true,
        identifier: item.identifier,
        promise: backend.inflectCandidate(this.globals.hot.lexicon, item.identifier)
      }
      this.$emit('goToCandidate', entryInfo)
    },
    addCandidates: async function () {
      const result = await backend.addCandidates(this.globals.hot.lexicon, this.newCandidates)
      for(const row of result) {
        Vue.set(this.data, this.data.length, row)
      }
      // TODO: check for errors
      this.showCandidateUpload = false
      this.newCandidates = ''
    },
    recomputeCandidates () {
      this.updatedCandidates = ''
      const that = this
      backend.recomputeCandidates(this.globals.hot.lexicon).then((data) =>
        that.updatedCandidates = data.updated
      )
    },
    sortTable (a, b, key) {
      if(key !== 'score') {
        let lang = undefined
        let options = { numeric: true}
        if(this.globals.lexicon !== 'votiska') {
          lang = 'sv'  // TODO use dictlang
        }
        return a[key].localeCompare(b[key], lang, options)
      } else {
        return a[key] < b[key] ? -1 : (a[key] > b[key] ? 1 : 0)
      }
    }
  },
  filters: {
    round: function (value) {
      if (!value) return ''
      return value.toFixed(1)
    }
  }
}
</script>

<style>
textarea {
  resize: none;
  width: 100%;
}
.padding > * {
  padding: 5px;
}
table.candidate-table > tbody {
  cursor: pointer;
}
</style>
