<template>
  <span>
    <span @click="edit = true" v-if="!edit">{{value}}</span>
    <input v-autofocus="true" type="text" v-if="edit" v-model="lol" @blur="edit = false">
  </span>
</template>

<script>
export default {
  name: 'EditText',
  data () {
    return {
      edit: false
    }
  },
  props: ['value'],
  computed: {
    lol: {
      get: function() {
        return this.value
      },
      set: function(modifiedValue) {
        this.$emit('input', modifiedValue)
      }
    }
  }
}
</script>

<style scoped>
</style>
