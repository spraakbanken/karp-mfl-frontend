<template>
  <div>
    <SuggestionsInput :globals="globals" @router="update" />
    <hr />
    <SuggestionsResult :globals="globals" @router="update" />
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
