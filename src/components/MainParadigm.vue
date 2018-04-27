<template>
  <Paradigm :paradigm-identifier='paradigm' @wordClicked="gotoWord" :globals="globals" @router="update"/>
</template>

<script>
import mix from '@/mix'
import Paradigm from '@/components/Paradigm'
import { EventBus } from '@/services/event-bus.js'

export default {
  mixins: [mix],
  name: 'MainParadigm',
  components: {
    Paradigm
  },
  data () {
    return {
    }
  },
  computed: {
    paradigm () {
      return this.globals.hot.paradigm
    }
  },
  methods: {
    gotoWord (identifier) {
      EventBus.$emit('routing', {view: 'word', identifier: identifier})
    }
  }
}
</script>

<style scoped>

</style>
