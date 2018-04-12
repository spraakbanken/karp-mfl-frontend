<template>
  <div class="row justify-content-center">
    <div v-if="hasPrevPage" class="col-auto" @click="prevPage()">
      {{loc('prev')}}
    </div>
    <div class="col-auto">
      {{loc('page')}} {{this.currentPage + 1}}
    </div>
    <div v-if="hasNextPage" class="col-auto" @click="nextPage">
      {{loc('next')}}
    </div>
  </div>
</template>

<script>
import mix from '@/mix'

export default {
  name: 'Pager',
  mixins: [mix],
  props: ['value'],
  data () {
    return {
    }
  },
  props: ['value'],
  computed: {
    currentPage: {
      get: function() {
        return this.value
      },
      set: function(modifiedValue) {
        this.$emit('input', modifiedValue)
      }
    },
    hasNextPage () {
      return true
    },
    hasPrevPage () {
      return this.currentPage > 0
    }
  },
  methods: {
    nextPage () {
      this.currentPage += 1
    },
    prevPage () {
      this.currentPage -= 1
    }
  }
}
</script>

<style scoped>
</style>
