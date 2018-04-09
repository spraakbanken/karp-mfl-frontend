<template>
  <div>
    <div>
      <a v-on:click="showParadigm()" :style="selectedOverviewStyle('paradigm')">{{ loc('paradigm') }}</a>
      | <a v-on:click="showWord()" :style="selectedOverviewStyle('word')">{{ loc('word') }}</a>
      <template v-for="(category, index) in categories">
        | <a v-on:click="showCategory(category)" :style="selectedOverviewStyle(category)">{{loc(category)}}</a>
      </template>
    </div>
    <hr />
    <div v-show="filterActive">{{filter.searchField}} = {{filter.searchValue}}</div>
    <hr v-show="filterActive" />
    <table>
      <tr>
        <td v-for="header in headers">{{header}}</td>
      </tr>
      <tr v-for="row in data">
        <td v-for="(elem, idx) in row" @click="goTo(row, idx)">{{elem}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import mix from '@/mix'
import backend from '@/services/backend'
import * as _ from 'lodash'

export default {
  mixins: [mix],
  name: 'Overiew',
  data () {
    return {
      showOverview: 0,
      headers: [],
      data: [],
      filter: {},
      selectedOverview: 'paradigm'
    }
  },
  computed: {
    categories () {
      return this.globals.hot.lexiconInfo.possible_lexiconFields
    },
    filterActive () {
      return !_.isEmpty(this.filter)
    }
  },
  created () {
    this.showParadigm()
  },
  methods: {
    selectedOverviewStyle (overview) {
      if(overview === this.selectedOverview) {
        return {'font-weight': 'bold'}
      } else {
        return {}
      }
    },
    goTo(row, index) {
      const field = this.headers[index]
      const cellContent = row[index]
      const filterKey = this.headers[0]
      const filterValue = row[0]
      
      const filter = {searchField: filterKey, searchValue: filterValue}
      this.filter = filter

      if(field == 'entries') {
        this.showWord(filter)
      } else if(field == 'paradigm') {
        if(typeof(cellContent) === "number") {
          this.showParadigm(filter)
        } else {
          console.log("TODO: go to paradigm")
        }
      } else if(field == 'lemgram') {
        console.log("TODO: go to word")
      } else {
        this.showCategory(field, filter)
      }
    },
    showParadigm: async function (filter) {
      this.selectedOverview = 'paradigm'
      const result = await backend.compileParadigm(filter)
      this.data = result.data
      this.headers = result.headers
    },
    showWord: async function (filter) {
      this.selectedOverview = 'word'
      const result = await backend.compileWordForm(filter)
      this.data = result.data
      this.headers = result.headers
    },
    showCategory: async function (category, filter) {
      this.selectedOverview = category
      const result = await backend.compileClass(category, filter)
      this.data = result.data
      this.headers = result.headers
    }
  }
}
</script>

<style scoped>
table {
  margin: auto;
}
</style>
