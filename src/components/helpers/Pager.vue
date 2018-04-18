<template>
  <div class="row justify-content-center">
    <div v-if="hasPrevPage" class="col-auto" @click="prevPage()">
      {{loc('prev')}}
    </div>
    <div class="col-auto">
      <span>{{loc('page')}} {{this.currentPage + 1}}</span>
      <span v-if="pageCount">{{loc('of')}} {{pageCount}}</span>
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
  props: ['value', 'pageCount'],
  data () {
    return {
    }
  },
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
      if (this.pageCount) {
        return this.currentPage + 1 < this.pageCount
      } else {
        return true
      }
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
