<template>
  <div>
    <Suggestions v-if="showSuggestions" :globals="globals" @router="update"/>
    <Overview v-if="showOverview" :globals="globals" @router="update"/>
    <Candidates v-if="showCandidates" :globals="globals" @router="update"/>
  </div>
</template>

<script>
import Overview from '@/components/Overview'
import Suggestions from '@/components/Suggestions'
import Candidates from '@/components/Candidates'
import mix from '@/mix'

export default {
  mixins: [mix],
  name: 'Header',
  data () {
    return {
    }
  },
  components: {
    Overview,
    Suggestions,
    Candidates
  },
  computed: {
    showSuggestions () {
      return this.globals.hot.currentView === 'suggestions'
    },
    showOverview () {
      return this.globals.hot.currentView === 'overview'
    },
    showCandidates () {
      return this.globals.hot.currentView === 'candidate'
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
