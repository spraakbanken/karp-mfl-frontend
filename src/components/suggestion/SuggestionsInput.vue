<template>
  <div>
    <div>
      <a v-on:click="setInputMethod(0)">{{ loc('bywordform') }}</a> |
      <a v-on:click="setInputMethod(1)">{{ loc('byword') }}</a> |
      <a v-on:click="setInputMethod(2)">{{ loc('bycategory') }}</a> |
      <a v-on:click="setInputMethod(3)">{{ loc('bytable') }}</a>
    </div>
    <ByWordForm v-if="inputMethod == 0" :globals="globals" @router="update"/>
    <ByWord v-else-if="inputMethod == 1" :globals="globals" @router="update"/>
    <ByCategory v-else-if="inputMethod == 2" :globals="globals" @router="update"/>
    <ByTable v-else-if="inputMethod == 3" :globals="globals" @router="update"/>
  </div>
</template>

<script>
import mix from '@/mix'
import ByWordForm from './ByWordForm'
import ByWord from './ByWord'
import ByCategory from './ByCategory'
import ByTable from './ByTable'

export default {
  mixins: [mix],
  name: 'SuggestionsMain',
  components: {
    ByWordForm,
    ByWord,
    ByCategory,
    ByTable
  },
  data () {
    return {
      inputMethod: 0
    }
  },
  methods: {
    setInputMethod (method) {
      this.inputMethod = method
    }
  }
}
</script>

<style scoped>

</style>
