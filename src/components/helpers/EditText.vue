<template>
  <span>
    <span @click="edit = true" v-if="!edit">{{value}}</span>
    <input v-autofocus="true" type="text" v-if="edit" v-model="lol" @blur="editDone()">
  </span>
</template>

<script>

// TODO: originalValue should be updated when user updates

export default {
  name: 'EditText',
  data () {
    return {
      edit: _.isEmpty(this.value),
      originalValue: this.value
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
  },
  methods: {
    editDone () {
      if(!_.isEmpty(this.value)) {
        this.edit = false
      }
      if(this.value !== this.originalValue) {
        this.$emit('tableEdit')
      }
    }
  }
}
</script>

<style scoped>
</style>
