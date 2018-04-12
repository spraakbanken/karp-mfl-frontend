<template>
  <div>
    <div class="row">
      <div class="col">
        <a v-on:click="showParadigm()" :style="selectedOverviewStyle('paradigm')">{{ loc('paradigm') }}</a>
        
        | <a v-on:click="showWord()" :style="selectedOverviewStyle('word')">{{ loc('word') }}</a>
        <template v-for="(category, index) in categories">
          | <a v-on:click="showCategory(category)" :style="selectedOverviewStyle(category)">{{loc(category)}}</a>
        </template>
      </div>
    </div>
    <hr v-show="filterActive" />
    <div v-show="filterActive" class="row">
      <div>{{filter.searchField}} = {{filter.searchValue}}</div>
      <div @click="clearFilter()">X</div>
    </div>
    
    <Pager v-model="currentPage" :globals="globals" @router="update"/>

    <div class="row">
      <div class="col">
        <b-table class="mt-3" striped hover :items="data" :fields="headers">
          <template :slot="field" slot-scope="data" v-for="(field, idx) in headers">
            <span @click="goTo(data.index, idx)" class="column-element">
              {{data.item[idx]}}
            </span>
          </template>
        </b-table>
      </div>
    </div>

    <Pager v-model="currentPage" :globals="globals" @router="update"/>

  </div>
</template>

<script>
import mix from '@/mix'
import backend from '@/services/backend'
import * as _ from 'lodash'
import Pager from '@/components/helpers/Pager'

export default {
  mixins: [mix],
  name: 'Overiew',
  components: {
    Pager
  },
  data () {
    return {
      headers: [],
      data: [],
      filter: {},
      selectedOverview: 'paradigm',
      currentPage: 0,
      pageSize: 25
    }
  },
  computed: {
    categories () {
      return _.keys(this.globals.hot.lexiconInfo.inflectionalclass)
    },
    filterActive () {
      return !_.isEmpty(this.filter)
    }
  },
  created () {
    this.showParadigm()
  },
  methods: {
    selectedOverviewStyle (overview) {
      if(overview === this.selectedOverview) {
        return {'font-weight': 'bold'}
      } else {
        return {}
      }
    },
    goTo(rowIdx, colIdx) {
      const field = this.headers[colIdx]
      const cellContent = this.data[rowIdx][colIdx]
      const filterKey = this.headers[0]
      const filterValue = this.data[rowIdx][0]
      
      const filter = {searchField: filterKey, searchValue: filterValue}

      if(field == 'entries') {
        this.filter = filter
        this.showWord()
      } else if(field == 'paradigm') {
        if(typeof(cellContent) === "number") {
          this.showParadigm()
          this.filter = filter
        } else {
          console.log("TODO: go to paradigm")
        }
      } else if(field == 'identifier') {
        console.log("TODO: go to word")
      } else {
        this.filter = filter
        this.showCategory(field)
      }
    },
    showParadigm: async function () {
      this.selectedOverview = 'paradigm'
      const result = await backend.compileParadigm(this.filter, this.pageSize, this.currentPage * this.pageSize)
      this.data = result.data
      this.headers = result.headers
    },
    showWord: async function () {
      this.selectedOverview = 'word'
      const result = await backend.compileWordForm(this.filter, this.pageSize, this.currentPage * this.pageSize)
      this.data = result.data
      this.headers = result.headers
    },
    showCategory: async function (category) {
      this.selectedOverview = category
      const result = await backend.compileClass(category, this.filter, this.pageSize, this.currentPage * this.pageSize)
      this.data = result.data
      this.headers = result.headers
    },
    switchPage () {
      if (this.selectedOverview === 'paradigm') {
        this.showParadigm()
      } else if (this.selectedOverview === 'word') {
        this.showWord()
      } else {
        this.showCategory(this.selectedOverview)
      }
    },
    clearFilter () {
      this.filter = {}
      this.currentPage = 0
    }
  },
  watch: {
    currentPage: function(newVal, oldVal) {
      this.switchPage()
    }
  }
}
</script>

<style scoped>
.column-element {
  cursor: pointer;
}
.column-element:hover {
  text-decoration: underline;
}
</style>
