<template>
  <ul class="pagination b-pagination pagination-md">
    <li v-for="[page, pageName] in pages" :class="{active: isCurrentPage(page)}" class="mfl-page-item page-item"
      :id="'pager' + pageName">
      <a @click="currentPage = page" class="mfl-page-link page-link" tabindex="tabIndex[page]">{{pageName}}</a>
      <b-tooltip :target="'pager' + pageName">
        {{pageName}}
      </b-tooltip>
    </li>
  </ul>
</template>

<script>
import mix from '@/mix'

export default {
  name: 'Pager',
  mixins: [mix],
  props: ['value', 'pageCount', 'keys'],
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
      const pageNumbers = Array.from(Array(this.pageCount), (e,i) => i)
      return _.zip(pageNumbers, this.keys)
    },
    tabindex () {
      return _.map(this.pages, (pageNum) => {
        if(this.value === pageNum) {
          return 0
        } else {
          return -1
        }
      })
    }
  },
  methods: {
    isCurrentPage (page) {
      return page === this.value
    }
  }
  
}
</script>

<style scoped>
li {
  max-width: 85px;
}
a {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
