<template>
  <Paradigm :paradigm-identifier='paradigm' @wordClicked="gotoWord" :globals="globals" @router="update"/>
</template>

<script>
import mix from '@/mix'
import Paradigm from '@/components/Paradigm'

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
      this.update('view', 'word')
      this.update('identifier', identifier)
    }
  }
}
</script>

<style scoped>

</style>
