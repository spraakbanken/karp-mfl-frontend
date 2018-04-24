<template>
  <ul class="pagination b-pagination pagination-md">
    <li v-for="page in pages" class="page-item d-none d-md-flex">
      <a @click="currentPage = page" class="mfl-page-link page-link">{{page + 1}}</a>
    </li>
  </ul>
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
    pages () {
      return Array.from(Array(this.pageCount), (e,i) => i)
    }
  }
}
</script>

<style scoped>
.mfl-page-link {
  color: #007bff !important;
}
</style>
