<template>
  <div v-if="showResult">
    <div v-for="(table, index) in inflectionTables" v-if="index == currentPage">
      <table>
        <tr v-for="row in table.WordForms">
          <td>{{row.msd}}</td>
          <td>{{row.writtenForm}}</td>
        </tr>
      </table>
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
    <button @click="gotoPrevPage"><-</button>
    <button @click="gotoNextPage">-></button>
  </div>
</template>

<script>
import mix from '@/mix'

export default {
  mixins: [mix],
  name: 'SuggestionsResult',
  data () {
    return {
      currentPage: 0
    }
  },
  computed: {
    showResult () {
      return this.inflectionTables.length > 0
    }
  },
  props: ['inflectionTables', 'newEntry'],
  methods: {
    gotoPrevPage () {
      this.currentPage -= 1
    },
    gotoNextPage () {
      this.currentPage += 1
    }
  }
}
</script>

<style scoped>
div {
  margin-top: 50px;
}
</style>
