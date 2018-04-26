<template>
  <OfflineTypeahead :dataset="tempCategoryValues" v-model="lol" :placeholder="loc('choose_value')" any-val="true" />
</template>

<script>
import mix from '@/mix'
import backend from '@/services/backend'
import OfflineTypeahead from '@/components/helpers/OfflineTypeahead'

export default {
  name: 'CategorySelector',
  mixins: [mix],
  data () {
    return {
      categoryValues: []
    }
  },
  components: {
    OfflineTypeahead
  },
  props: ['value', 'category'],
  computed: {
    lexicon () {
      // TODO: this is wrong, because it depens on in which context
      // the selector is used
      return this.globals.hot.lexicon
    },
    lol: {
      get: function() {
        return this.value
      },
      set: function(modifiedValue) {
        this.$emit('input', modifiedValue)
      }
    },
    tempCategoryValues () {
      return _.map(_.filter(this.categoryValues, (elem) => elem[0]), (elem) => {
        return {
          value: elem[0], 
          label: elem[0] + ' (' + elem[1] + ')'
        }
      })
    }
  },
  methods: {
    updateList: async function () {
      const lexicon = this.globals.hot.lexicon
      if(this.category === 'paradigm') {
        this.categoryValues = await backend.listParadigm(lexicon)
      } else {
        this.categoryValues = await backend.listClass(lexicon, this.category)
      }
    }
  },
  watch: {
    category: {
      immediate: true,
      handler () {
        this.updateList()
      }
    },
    lexicon: {
      handler () {
        this.updateList()
      }
    }
  }
}
</script>

<style scoped>
</style>
