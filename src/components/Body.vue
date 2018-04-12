<template>
  <div>
    <div v-if="showSuggestions">
      <SuggestionsInput :globals="globals" @router="update" />
      <hr />
      <Entry :globals="globals" @router="update" />
    </div>
    <Overview v-if="showOverview" :globals="globals" @router="update"/>
    <Candidates v-if="showCandidates" :globals="globals" @router="update"/>
    <Entry v-show="showTable" :globals="globals" @router="update" />
  </div>
</template>

<script>
import Overview from '@/components/Overview'
import Candidates from '@/components/Candidates'
import SuggestionsInput from '@/components/suggestion/SuggestionsInput'
import Entry from '@/components/suggestion/Entry'
import mix from '@/mix'

export default {
  mixins: [mix],
  name: 'Header',
  props: ['candidatePermission'],
  data () {
    return {
    }
  },
  components: {
    Overview,
    Candidates,
    Entry,
    SuggestionsInput
  },
  computed: {
    showSuggestions () {
      return this.globals.hot.currentView === 'suggestions'
    },
    showOverview () {
      return this.globals.hot.currentView === 'overview'
    },
    showCandidates () {
      return this.candidatePermission && this.globals.hot.currentView === 'candidatelist'
    },
    showTable () {
      return this.globals.hot.currentView === 'table'
    }
  }
}
</script>

<style scoped>
h1 {
  color: grey;
}
li {
  padding: 10px;
  display: inline;
}
</style>
