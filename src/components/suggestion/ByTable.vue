<template>
  <div>
    <select v-model="pos">
      <option v-for="posTag in posTags" :value="posTag">{{posTag}}</option>
    </select>
    <div>
      <table>
        <tr v-for="row in tableRows">
          <td><input type="text" v-model="row.msd"></td>
          <td><input type="text" v-model="row.value"></td>
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
      tableRows: [{msd: '', value: ''}],
      pos: this.posTags[0]
    }
  },
  methods: {
    async giveSuggestion () {
      EventBus.$emit('inflectionResultEvent', await backend.inflectTable(this.globals.hot.lexicon, this.tableRows, this.pos))
    },
    addTableRow () {
      this.tableRows.push({msd: '', value: ''})
    }
  },
  props: ['pos-tags']
}
</script>

<style scoped>
div {
  margin-top: 20px;
}
</style>
