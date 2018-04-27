<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-auto pb-3">
        <a v-on:click="selectedOverview = 'paradigm'" :style="selectedOverviewStyle('paradigm')">{{ loc('paradigm') }}</a>
        
        | <a v-on:click="selectedOverview = 'word'" :style="selectedOverviewStyle('word')">{{ loc('word') }}</a>
        <template v-for="(category, index) in categories">
          | <a v-on:click="selectedOverview = category" :style="selectedOverviewStyle(category)">{{loc(category)}}</a>
        </template>
      </div>
    </div>
    <hr v-show="filterActive" />
    <div v-show="filterActive" class="row">
      <div v-for="(filter, idx) in filters" class="col-auto pill">
        <span>{{filter[0]}} = {{filter[1]}}</span>
        <span @click="clearFilter(idx)"><icon name="times-circle"></icon></span>
      </div>
    </div>

    <div class="row justify-content-center">
      <div class="col-auto">
        <b-dropdown id="ddown1" :text="loc('choose_pos')" class="m-md-2">
          <b-dropdown-item :class="{'selected-pos' : isSelected(pos)}" 
                           :key="pos" 
                           v-for="pos in posTags"
                           @click="addPosFilter(pos)">
            {{pos}}
          </b-dropdown-item>
        </b-dropdown>
      </div>
      <div class="col-auto">
        <b-pagination class="m-md-2" size="md" :total-rows="totalRows" v-model="currentPage" :per-page="pageSize"></b-pagination>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <b-table class="mt-3" striped hover :items="data" :fields="fields">
          <template :slot="field" slot-scope="data" v-for="(field, idx) in headers">
            <span @click="goTo(data.index, idx)" :class="{ 'column-element': clickable[idx] }">
              {{data.item[idx]}}
            </span>
          </template>
        </b-table>
      </div>
    </div>
    
    <div class="row justify-content-center">
      <div class="col-auto">
        <b-pagination size="md" :total-rows="totalRows" v-model="currentPage" :per-page="pageSize"></b-pagination>
      </div>
    </div>

  </div>
</template>

<script>
import Vue from 'vue'
import mix from '@/mix'
import backend from '@/services/backend'
import * as _ from 'lodash'
import Pager from '@/components/helpers/Pager'
import { EventBus } from '@/services/event-bus.js'

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
      currentPage: 1,
      pageSize: 25,
      totalRows: 0,
      posTags: [],
      posFilter: []
    }
  },
  computed: {
    lexicon () {
      return this.globals.hot.lexicon
    },
    filters () {
      if (this.globals.hot.tableFilter.length > 0) {
        return _.map(decodeURI(this.globals.hot.tableFilter).split('|'), (filter) => {
          const [filterKey, filterVals] = filter.split(' ')
          return [filterKey, filterVals.split(',')[0]] // TODO: allow more than one value
        })
      } else {
        return []
      }
    },
    selectedOverview: {
      get () {
        return this.globals.hot.overview
      },
      set (overview) {
        return this.update('overview', overview)
      }
    },
    categories () {
      return _.keys(this.globals.hot.lexiconInfo.inflectionalclass)
    },
    filterActive () {
      return !_.isEmpty(this.filters)
    },
    fields () {
      return _.map(this.headers, (header) => {
        return {
          key: header,
          label: this.loc(header)
        }
      })
    },
    clickable () {
      return _.map(this.headers, (header) => {
        if(this.selectedOverview === 'word') {
          return !_.includes(['baseform', 'partOfSpeech', 'inherent'], header)
        } else {
          return true
        }
      })
    }
  },
  methods: {
    isSelected (pos) {
      return _.includes(this.posFilter, pos)
    },
    addPosFilter (pos) {
      if (this.isSelected(pos)) {
        this.posFilter.splice(this.posFilter.indexOf(pos), 1)
      } else {
        return Vue.set(this.posFilter, this.posFilter.length, pos)
      }
    },
    selectedOverviewStyle (overview) {
      if(overview === this.selectedOverview) {
        return {'font-weight': 'bold'}
      } else {
        return {}
      }
    },
    goTo(rowIdx, colIdx) {
      if(!this.clickable[colIdx]) {
        return
      }
      
      const field = this.headers[colIdx]
      const cellContent = this.data[rowIdx][colIdx]
      const filterKey = this.headers[0]
      const filterValue = this.data[rowIdx][0]
      const filter = [filterKey, filterValue]

      if(field == 'entries') {
        this.addFilter(filter)
        this.selectedOverview = 'word'
      } else if(field == 'paradigm') {
        if(typeof(cellContent) === "number") {
          // TODO both filters and selectedOverview watches get triggered
          this.addFilter(filter)
          this.selectedOverview = 'paradigm'
        } else {
          this.gotoParadigm(cellContent)
        }
      } else if(field == 'identifier') {
        this.gotoWord(cellContent)
      } else {
        this.addFilter(filter)
        this.selectedOverview = field
      }
    },
    gotoWord: async function (identifier) {
      EventBus.$emit('routing', {view: 'word', identifier: identifier})
    },
    gotoParadigm: async function (paradigm) {
      EventBus.$emit('routing', {view: 'paradigm', paradigm: paradigm})
    },
    showParadigm: async function () {
      const result = await backend.compileParadigm(this.globals.hot.lexicon, this.filters, this.posFilter, this.pageSize, (this.currentPage - 1) * this.pageSize)
      this.data = result.data
      this.headers = result.headers
      this.totalRows = result.total
    },
    showWord: async function () {
      const result = await backend.compileWordForm(this.globals.hot.lexicon, this.filters, this.posFilter, this.pageSize, (this.currentPage - 1) * this.pageSize)
      this.data = result.data
      this.headers = result.headers
      this.totalRows = result.total
    },
    showCategory: async function (category) {
      const result = await backend.compileClass(this.globals.hot.lexicon, category, this.filters, this.posFilter, this.pageSize, (this.currentPage - 1) * this.pageSize)
      this.data = result.data
      this.headers = result.headers
      this.totalRows = result.total
    },
    updateTable () {
      if (this.selectedOverview === 'paradigm') {
        this.showParadigm()
      } else if (this.selectedOverview === 'word') {
        this.showWord()
      } else {
        this.showCategory(this.selectedOverview)
      }
    },
    resetTable () {
      this.currentPage = 1
      this.updateTable()
    },
    addFilter (filter) {
      this.filters.push(filter)
      this.updateFilterParam()
    },
    clearFilter (idx) {
      this.filters.splice(idx, 1)
      this.updateFilterParam()
    },
    updateFilterParam () {
      const filter = _.map(this.filters, (filter) => {
        return filter[0] + ' ' + filter[1] // TODO filter[1] will be an array
      }).join('|')
      this.update('tableFilter', encodeURI(filter))
    }
  },
  watch: {
    currentPage: function(newVal, oldVal) {
      this.updateTable()
    },
    filters (newVal, oldVal) {
      this.resetTable()
    },
    posFilter (newVal, oldVal) {
      this.resetTable()
    },
    lexicon: {
      immediate: true,
      handler (newVal, oldVal) {
        const vm = this
        backend.getPosTags(this.lexicon).then((res) => {
          vm.posFilter = [res[0]]
          vm.posTags = res
        })
      }
    },
    selectedOverview: {
      immediate: true,
      handler: function (val, oldVal) {
        this.resetTable()
      }
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
.pill {
  padding: 10px;
  border: 1px solid black;
  border-radius: 20px;
}
.selected-pos {
  font-weight: bold;
}
</style>
