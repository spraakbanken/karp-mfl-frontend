<template>
  <!-- TODO: restore count -->
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
    lol: {
      get: function() {
        return this.value
      },
      set: function(modifiedValue) {
        this.$emit('input', modifiedValue)
      }
    },
    tempCategoryValues () {
      return _.map(this.categoryValues, (elem) => elem[0])
    }
  },
  watch: {
    category: {
      immediate: true,
      handler: async function (val, oldVal) {
        if(val === 'paradigm') {
          this.categoryValues = await backend.listParadigm()
        } else {
          this.categoryValues = await backend.listClass(val)
        }
      }
    }
  }
}
</script>

<style scoped>
</style>
