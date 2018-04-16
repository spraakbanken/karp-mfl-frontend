<template>
  <div>
    <div>
      <button class="btn btn-primary" v-b-modal.addCandidatesModal>{{loc('add_candidates')}}</button>
      <b-modal id="addCandidatesModal" :title="loc('add_candidates')" size="lg" v-model="showCandidateUpload">
        <b-container fluid class="padding">
          <div class="row justify-content-start">
            <div class="col-auto">
              <input type="file" ref="fileUpload" style="display:none" @change="handleFile($event.target.files)">
              <button @click="openFileUpload()">{{loc('pick_files')}}</button>
            </div>
          </div>
          <div class="row justify-content-center">
            <div class="col">
              <!-- TODO: probably use code mirror instead of this hack -->
              <textarea onkeydown="if(event.keyCode===9){var v=this.value,s=this.selectionStart,e=this.selectionEnd;this.value=v.substring(0, s)+'\t'+v.substring(e);this.selectionStart=this.selectionEnd=s+1;return false;}"
                        v-model="newCandidates" rows="20" cols="79"></textarea>
            </div>
          </div>
          <div class="row justify-content-end">
            <div class="col-auto">
              <button @click="addCandidates">{{loc('add_candidates')}}</button>
            </div>
          </div>
        </b-container>
        <div slot="modal-footer"></div>
      </b-modal>
    </div>
    
    <b-table class="mt-3" striped hover :items="data" :fields="fields" @row-clicked="gotoCandidate"></b-table>

  </div>
</template>

<script>
import mix from '@/mix'
import backend from '@/services/backend'
import * as _ from 'lodash'
import { EventBus } from '@/services/event-bus.js'

export default {
  mixins: [mix],
  name: 'Candidates',
  data () {
    return {
      data: [],
      showCandidateUpload: false,
      newCandidates: '',
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
  created () {
    this.getCandidateList()
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
      this.data = await backend.getCandidateList()
    },
    gotoCandidate: async function (item, index) {
      this.update('view', 'table')
      const entryInfo = {
        candidate: true,
        identifier: item.identifier,
        promise: backend.inflectCandidate(this.globals.hot.lexicon, item.identifier)
      }
      EventBus.$emit('inflectionResultEvent', entryInfo)
    },
    addCandidates: async function () {
      const result = await backend.addCandidates(this.globals.hot.lexicon, this.newCandidates)
      this.getCandidateList()
      // TODO: check for errors
      this.showCandidateUpload = false
      this.newCandidates = ''
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

<style scoped>
textarea {
  resize: none;
  width: 100%;
}
.padding > * {
  padding: 5px;
}
</style>
