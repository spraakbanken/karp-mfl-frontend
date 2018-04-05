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
        <td v-for="elem in row">{{elem}}</td>
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
      data: [],
      categories: this.globals.hot.lexiconInfo.possible_lexiconFields
    }
  },
  methods: {
    showParadigm: async function () {
      const result = await backend.compileParadigm()
      this.data = result.data
      this.headers = result.headers
    },
    showWord: async function () {
      const result = await backend.compileWordForm()
      this.data = result.data
      this.headers = result.headers
    },
    showCategory: async function (category) {
      const result = await backend.compileClass(category)
      this.data = result.data
      this.headers = result.headers
    }
  }
}
</script>

<style scoped>

</style>
