<template>
  <div>
    <InflectionTable
      v-if="showTable"
      :inflection-table="table"
      :identifier-error="false"
      :should-update="false"
      :classes="[]"
      :globals="globals" @router="update"
      :korpCount="{}" />
    <div v-else>
      <icon name="spinner" spin></icon>
    </div>
  </div>
</template>

<script>
import mix from '@/mix'
import InflectionTable from '@/components/InflectionTable'
import backend from '@/services/backend'

export default {
  mixins: [mix],
  name: 'Word',
  components: {
    InflectionTable
  },
  data () {
    return {
      table: {}
    }
  },
  computed: {
    identifier () {
      return this.globals.hot.identifier
    },
    showTable () {
      return !_.isEmpty(this.table)
    }
  },
  created: async function () {
    this.table = await backend.wordInfo(this.globals.hot.lexicon, this.identifier)
  }
}
</script>

<style scoped>

</style>
