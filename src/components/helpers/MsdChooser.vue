<template>
  <div>
    <OfflineTypeahead v-show="showInput"
                  :dataset="dataset" 
                  v-model="lol"
                  :placeholder="loc('choose_value')" 
                  any-val="true"
                  @input="change()"
                  @blur="blur()"
                  ref="offlineTypeahead" />
                  
    <span v-show="!showInput" @click="startEdit()">
      {{value}}
    </span>
  </div>
</template>

<script>
import Vue from 'vue'
import mix from '@/mix'
import backend from '@/services/backend'
import OfflineTypeahead from '@/components/helpers/OfflineTypeahead'

export default {
  name: 'MsdChooser',
  mixins: [mix],
  data () {
    return {
      inEdit: false
    }
  },
  components: {
    OfflineTypeahead
  },
  props: ['value', 'dataset'],
  computed: {
    showInput () {
      return this.inEdit || _.isEmpty(this.value)
    },
    lol: {
      get: function() {
        return this.value
      },
      set: function(modifiedValue) {
        this.$emit('input', modifiedValue)
      }
    }
  },
  methods: {
    startEdit () {
      this.inEdit = true
      const vm = this
      Vue.nextTick(function () {
        vm.$refs.offlineTypeahead.focus()
      })
    },
    change () {
      this.inEdit = false
      this.$emit('tableEdit')
    },
    blur () {
      this.inEdit = false
    }
  }
}
</script>

<style scoped>
</style>
