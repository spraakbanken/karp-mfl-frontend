<template>
  <div>
    <select v-model="partOfSpeech">
      <option v-for="posTag in posTags" :value="posTag">{{posTag}}</option>
    </select>
    <div>
      <table>
        <tr v-for="row in tableRows">
          <td>
            <select v-model="row.msd">
              <option v-for="msdTag in availableMsdTags" :value="msdTag">{{msdTag}}</option>
            </select>
          </td>
          <td><input type="text" v-model="row.writtenForm"></td>
        </tr>
      </table>
      <button v-on:click="addTableRow()">+</button>
    </div>
    <button v-on:click="giveSuggestion()">{{loc('give_suggestion')}}</button>
  </div>
</template>

<script>
import mix from '@/mix'
import backend from '@/services/backend'
import { EventBus } from '@/services/event-bus.js';

export default {
  mixins: [mix],
  name: 'ByTable',
  data () {
    return {
      tableRows: [{msd: '', writtenForm: ''}],
      partOfSpeech: this.posTags[0],
      availableMsdTags: []
    }
  },
  watch: {
    partOfSpeech: {
      immediate: true,
      handler: async function(val, oldVal) {
        this.availableMsdTags = await backend.defaultTable(this.globals.hot.lexicon, this.partOfSpeech)
      }
    }
  },
  methods: {
    async giveSuggestion () {
      EventBus.$emit('inflectionResultEvent', await backend.inflectTable(this.globals.hot.lexicon, this.tableRows, this.partOfSpeech))
    },
    addTableRow () {
      this.tableRows.push({msd: '', writtenForm: ''})
    }
  },
  props: ['pos-tags']
}
</script>

<style scoped>
div {
  margin-top: 20px;
}
table {
  margin: auto;
}
</style>
