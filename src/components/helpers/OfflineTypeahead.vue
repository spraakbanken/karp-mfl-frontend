<template>
  <div class="dropdown">
    <input @click="showDropdown()" type="text" v-model="query"  :placeholder="placeholder"
            autocomplete="off"
            @keydown.down="down"
            @keydown.up="up"
            @keydown.enter="hit"
            @keydown.esc="reset"
            @blur="reset"
            class="dropdown-toggle"
            />
    <div class="dropdown-menu" :class="{'show': dropdownOpen}">
      <div v-for="(elem, idx) in filteredView" @click="selectElement(elem)" class="typeahead-elem" :class="{'active-typeahead': elemActive(idx)}">
        {{elem}}
      </div>
    </div>
  </div>
</template>

<script>
import * as _ from 'lodash'

export default {
  name: 'OfflineTypeahead',
  data () {
    return {
      query: '',
      dropdownOpen: false,
      activeElem: 0
    }
  },
  props: ['value', 'dataset', 'placeholder', 'anyVal'],
  computed: {
    filteredView () {
      if(this.query !== '') {
        return _.filter(this.dataset, (elem) => _.includes(elem, this.query))
      } else {
        return this.dataset
      }
    }
  },
  methods: {
    closeDropdown () {
      this.dropdownOpen = false
    },
    showDropdown () {
      this.dropdownOpen = true
    },
    selectElement (elem) {
      // TODO: blur sker istället för click så den här kallas inte på om man klickar på element
      this.$emit('input', elem)
      this.dropdownOpen = false
      this.query = elem
    },
    down () {
      if(this.activeElem + 1 < this.filteredView.length) {
        this.activeElem += 1
      }
    },
    up () {
      if (this.activeElem > 0) {
        this.activeElem -= 1
      }
    },
    hit () {
      this.selectElement(this.filteredView[this.activeElem])
    },
    reset () {
      this.activeElem = 0
      if (!this.value && this.anyVal) {
        this.selectElement(this.query)
      } else {
        if (this.value) {
          this.query = this.value
        }
      }
      this.dropdownOpen = false
    },
    elemActive (idx) {
      return this.activeElem == idx
    }
  }
}
</script>

<style scoped>
.active-typeahead {
  background-color: lightgrey;
}
.typeahead-elem {
  padding-left: 10px;
}
</style>
