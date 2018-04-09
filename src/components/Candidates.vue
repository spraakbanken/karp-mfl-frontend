<template>
  <div>
    <div>
      <button>{{loc('add_candidates')}}</button>
    </div>
    <hr />
    <table>
      <tr>
        <td v-for="header in headers">{{header}}</td>
      </tr>
      <tr v-for="row in data">
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

export default {
  mixins: [mix],
  name: 'Candidates',
  data () {
    return {
      headers: [],
      data: []
    }
  },
  created () {
    this.getCandidateList()
  },
  methods: {
    getCandidateList: async function () {
      const data = await backend.getCandidateList()
      this.headers = data.headers
      this.data = data.data
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
</style>
