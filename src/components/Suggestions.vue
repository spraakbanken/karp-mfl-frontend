<template>
  <div>
    <SuggestionsInput :globals="globals" @router="update" />
    <hr />
    <Entry :globals="globals" @router="update" />
  </div>
</template>

<script>
import mix from '@/mix'
import SuggestionsInput from '@/components/suggestion/SuggestionsInput'
import Entry from '@/components/suggestion/Entry'

export default {
  mixins: [mix],
  name: 'Suggestions',
  data () {
    return {
    }
  },
  components: {
    SuggestionsInput,
    Entry
  }
}
</script>

<style scoped>

</style>
