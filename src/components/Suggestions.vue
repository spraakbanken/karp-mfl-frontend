<template>
  <div>
    <SuggestionsInput :globals="globals" @router="update"/>
    <SuggestionsResult />
  </div>
</template>

<script>
import mix from '@/mix'
import SuggestionsInput from '@/components/SuggestionsInput'
import SuggestionsResult from '@/components/SuggestionsResult'

export default {
  mixins: [mix],
  name: 'Suggestions',
  data () {
    return {
    }
  },
  components: {
    SuggestionsInput,
    SuggestionsResult
  }
}
</script>

<style scoped>

</style>
