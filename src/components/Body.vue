<template>
  <div>
    <div v-if="showSuggestions">
      <SuggestionsInput :globals="globals" @router="update" />
      <hr />
      <Entry :globals="globals" @router="update" />
    </div>
    <Overview v-if="showOverview" :globals="globals" @router="update"/>
    <Candidates v-if="showCandidates" :globals="globals" @router="update" @goToCandidate="goToCandidate"/>
    <Entry v-if="showCandidate" :globals="globals" @router="update" @readyEvent="goToCandidateFulhack"/>
    <Word v-if="showWord" :globals="globals" @router="update" />
    <MainParadigm v-if="showParadigm" :globals="globals" @router="update" />
  </div>
</template>

<script>
import { EventBus } from '@/services/event-bus.js'
import Overview from '@/components/Overview'
import Candidates from '@/components/Candidates'
import SuggestionsInput from '@/components/suggestion/SuggestionsInput'
import Entry from '@/components/suggestion/Entry'
import Word from '@/components/Word'
import MainParadigm from '@/components/MainParadigm'
import mix from '@/mix'

export default {
  mixins: [mix],
  name: 'Header',
  props: ['candidatePermission'],
  data () {
    return {
      showCandidateFulhack: ''
    }
  },
  components: {
    Overview,
    Candidates,
    Entry,
    Word,
    MainParadigm,
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
    showCandidate () {
      return this.globals.hot.currentView === 'table'
    },
    showWord () {
      return this.globals.hot.currentView === 'word'
    },
    showParadigm () {
      return this.globals.hot.currentView === 'paradigm'
    }
  },
  methods: {
    goToCandidate (entryInfo) {
      this.showCandidateFulhack = entryInfo
      EventBus.$emit('routing', {view: 'table'})
    },
    goToCandidateFulhack () {
      EventBus.$emit('inflectionResultEvent', this.showCandidateFulhack)
    }
  },
  created () {
    const vm = this
    EventBus.$on('routing', (routingObj) => {
      const rewriteObj = {
        identifier: '',
        paradigm: '',
        tableFilter: '',
        overview: 'paradigm'
      }

      for (const key of _.keys(routingObj)) {
        rewriteObj[key] = routingObj[key]
      }

      this.update(_.map(rewriteObj, (value, param) => {
        return { value, param }
      }))
    })
    
    if(this.globals.hot.currentView === 'table') {
      this.update('view', 'suggestions')
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
