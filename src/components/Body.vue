<template>
  <Suggestions :globals="globals" @router="update"/>
</template>

<script>
import Overview from '@/components/Overview'
import Suggestions from '@/components/Suggestions'
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
    Suggestions
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
