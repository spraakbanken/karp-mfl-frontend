<template>
  <div v-if="showResult">
    <div v-for="(table, index) in inflectionTables" v-if="index == currentPage">
      <div v-bind:style="inflectionTableClass">
        <table>
          <tr v-for="row in table.WordForms">
            <td><EditText v-model="row.msd" /></td>
            <td><EditText v-model="row.writtenForm" /></td>
          </tr>
        </table>
      </div>
      <hr/>
      <table>
        <tr>
          <td>lemgram</td>
          <td><input type="text" v-model="table.lemgram" placeholder="..."></input></td>
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
    <button @click="saveToKarp()">{{loc('save')}}</button>
  </div>
</template>

<script>
import mix from '@/mix'
import { EventBus } from '@/services/event-bus.js'
import EditText from '@/components/helpers/EditText'

export default {
  mixins: [mix],
  name: 'Entry',
  components: {
    EditText
  },
  data () {
    return {
      currentPage: 0,
      inflectionTables: []
    }
  },
  computed: {
    showResult () {
      return this.inflectionTables.length > 0
    },
    numResults () {
      return this.inflectionTables.length
    },
    inflectionTableClass () {
      const numElems = _.reduce(this.inflectionTables, (acc, table) => {
        const l = table.WordForms.length
          if(l > acc) {
            return l
          } else { 
            return acc 
          } 
        }, -1)
      return {
        height: numElems * 27 + "px"
      }
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
      console.log('TODO', this.inflectionTables[this.currentPage])
    }
  },
  mounted: function () {
    const setResult = function (obj) {
      return function (result) {
        obj.inflectionTables = result.Results
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
