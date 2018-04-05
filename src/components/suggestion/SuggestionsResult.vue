<template>
  <div v-if="showResult">
    <div v-for="(table, index) in inflectionTables" v-if="index == currentPage">
      <table>
        <tr v-for="row in table.WordForms">
          <td>{{row.msd}}</td>
          <td>{{row.writtenForm}}</td>
        </tr>
      </table>
      <hr/>
      <table>
        <tr>
          <td>lemgram</td>
          <td>{{table.lemgram}}</td>
        </tr>
        <tr>
          <td>paradigm</td>
          <td>{{table.paradigm}}</td>
        </tr>
        <tr>
          <td>part of speech</td>
          <td>{{table.partOfSpeech}}</td>
        </tr>
      </table>
    </div>
    <hr />
    <button @click="gotoPrevPage" v-if="currentPage > 0"><-</button>
    <span>{{loc('page')}} {{currentPage + 1}} {{loc('of')}} {{numResults}}</span>
    <button @click="gotoNextPage" v-if="currentPage < (numResults - 1)">-></button>
    <hr />
    <button @click="saveToKarp">{{loc('save')}}</button>
  </div>
</template>

<script>
import mix from '@/mix'
import { EventBus } from '@/services/event-bus.js'

export default {
  mixins: [mix],
  name: 'SuggestionsResult',
  data () {
    return {
      currentPage: 0,
      inflectionTables: [],
      newEntry: false
    }
  },
  computed: {
    showResult () {
      return this.inflectionTables.length > 0
    },
    numResults () {
      return this.inflectionTables.length
    }
  },
  methods: {
    gotoPrevPage () {
      this.currentPage -= 1
    },
    gotoNextPage () {
      this.currentPage += 1
    },
    saveToKarp: function () {
      console.log('TODO')
    }
  },
  mounted: function () {
    const setResult = function (obj) {
      return function (result) {
        obj.inflectionTables = result.Results
        obj.newEntry = result.new
        obj.currentPage = 0
      }
    }
    // TODO: det är förmodligen dåligt att skicka stora mängder data via eventbussen??
    EventBus.$on('inflectionResultEvent', setResult(this))
  }
}
</script>

<style scoped>
div {
  margin-top: 50px;
}
table {
  margin: auto;
}
</style>
