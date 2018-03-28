<template>
  <div>
    <div>
      <a v-on:click="showParadigm()">{{ loc('paradigm') }}</a>
      | <a v-on:click="showWord()">{{ loc('word') }}</a>
      <template v-for="(category, index) in categories">
        | <a v-on:click="showCategory(category)">{{loc(category)}}</a>
      </template>
    </div>
    <div>
      <div v-for="row in data">{{row}}</div>
    </div>
  </div>
</template>

<script>
import mix from '@/mix'
import backend from '@/services/backend'

export default {
  mixins: [mix],
  name: 'Overiew',
  data () {
    return {
      showOverview: 0,
      data: [],
      categories: ["bklass", "fmparadigms"]
    }
  },
  methods: {
    showParadigm: async function () {
      this.data = await backend.compileParadigm()
    },
    showWord: async function () {
      this.data = await backend.compileWordForm()
    },
    showCategory: async function (category) {
      this.data = await backend.compileClass(category)
    }
  }
}
</script>

<style scoped>

</style>
