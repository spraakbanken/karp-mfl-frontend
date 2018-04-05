<template>
  <div>
    <div>
      <a v-on:click="showParadigm()">{{ loc('paradigm') }}</a>
      | <a v-on:click="showWord()">{{ loc('word') }}</a>
      <template v-for="(category, index) in categories">
        | <a v-on:click="showCategory(category)">{{loc(category)}}</a>
      </template>
    </div>
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

export default {
  mixins: [mix],
  name: 'Overiew',
  data () {
    return {
      showOverview: 0,
      headers: [],
      data: []
    }
  },
  computed: {
    categories () {
      return this.globals.hot.lexiconInfo.possible_lexiconFields
    }
  },
  created () {
    this.showParadigm()
  },
  methods: {
    goTo(row, index) {
      const field = this.headers[index]
      const cellContent = row[index]
      const filterKey = this.headers[0]
      const filterValue = row[0]
      
      const filter = {}
      filter[filterKey] = filterValue

      if(field == 'entries') {
        console.log("go to word overview")
      } else if(field == 'paradigm') {
        if(typeof(cellContent) === "number") {
          this.showParadigm(filter)
        } else {
          console.log("go to paradigm")
        }
      } else if(field == 'lemgram') {
        console.log("go to word")
      } else {
        this.showCategory(field, filter)
      }
    },
    showParadigm: async function (filter) {
      const result = await backend.compileParadigm(filter)
      this.data = result.data
      this.headers = result.headers
    },
    showWord: async function (filter) {
      const result = await backend.compileWordForm(filter)
      this.data = result.data
      this.headers = result.headers
    },
    showCategory: async function (category, filter) {
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
