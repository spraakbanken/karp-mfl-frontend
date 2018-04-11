<template>
  <div>
    <div>
      <button v-b-modal.addCandidatesModal>{{loc('add_candidates')}}</button>
      <b-modal id="addCandidatesModal" :title="loc('add_candidates')" size="lg" v-model="showCandidateUpload">
        <b-container fluid>
          <div class="row justify-content-start">
            <div class="col-3">
              <input type="file" ref="fileUpload" style="display:none" @change="handleFile($event.target.files)">
              <button @click="openFileUpload()">{{loc('pick_files')}}</button>
            </div>
          </div>
          <div class="row justify-content-center">
            <div class="col">
              <!-- TODO: probably use code mirror instead of this hack -->
              <textarea onkeydown="if(event.keyCode===9){var v=this.value,s=this.selectionStart,e=this.selectionEnd;this.value=v.substring(0, s)+'\t'+v.substring(e);this.selectionStart=this.selectionEnd=s+1;return false;}"
                        v-model="newCandidates" rows="20" cols="80"></textarea>
            </div>
          </div>
          <div class="row justify-content-end">
            <div class="col-3">
              <button @click="addCandidates">{{loc('add_candidates')}}</button>
            </div>
          </div>
        </b-container>
        <div slot="modal-footer"></div>
      </b-modal>
    </div>
    <hr />
    <table>
      <tr>
        <td v-for="header in headers">{{header}}</td>
      </tr>
      <tr v-for="{row, identifier} in data" @click="gotoCandidate(identifier)">
        <td>{{row[0]}}</td>
        <td>{{row[1]}}</td>
        <td>{{row[2]}}</td>
        <td>{{row[3] | round}}</td>
      </tr>
    </table>
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
      headers: [],
      data: [],
      showCandidateUpload: false,
      newCandidates: ''
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
      const data = await backend.getCandidateList()
      this.headers = data.headers
      this.data = data.data
    },
    gotoCandidate: async function (identifier) {
      this.update('view', 'suggestions')
      const entryInfo = {
        candidate: true,
        identifier: identifier,
        promise: backend.inflectCandidate(this.globals.hot.lexicon, identifier)
      }
      EventBus.$emit('inflectionResultEvent', entryInfo)
    },
    addCandidates: async function () {
      const result = await backend.addCandidates(this.globals.hot.lexicon, this.newCandidates)
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
table {
  margin: auto;
}
textarea {
  resize: none;
}
</style>
