<template>
  <div>
    <SuggestionsInput :globals="globals" @router="update" v-on:inflectionResultEvent="thisIsCrazy"/>
    <SuggestionsResult :globals="globals" @router="update" :inflectionTables="inflectionTables" :new-entry="newEntry"/>
  </div>
</template>

<script>
import mix from '@/mix'
import SuggestionsInput from '@/components/suggestion/SuggestionsInput'
import SuggestionsResult from '@/components/suggestion/SuggestionsResult'

export default {
  mixins: [mix],
  name: 'Suggestions',
  data () {
    return {
      inflectionTables: [],
      newEntry: false
    }
  },
  components: {
    SuggestionsInput,
    SuggestionsResult
  },
  methods: {
    thisIsCrazy (result) {
      this.inflectionTables = result.Results
      this.newEntry = result.new
      // this.info = needed?
    }
  }
}
</script>

<style scoped>

</style>
