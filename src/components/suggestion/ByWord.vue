<template>
  <div>
    <input v-autofocus="true" type="text" :placeholder="loc('give_wordform')" v-model="wordForm">
    {{loc('inflect_like')}}
    <input v-autofocus="true" type="text" />
    <button v-on:click="giveSuggestion()">{{loc('give_suggestion')}}</button>
  </div>
</template>

<script>
import mix from '@/mix'
import backend from '@/services/backend'
import { EventBus } from '@/services/event-bus.js';

export default {
  mixins: [mix],
  name: 'ByWord',
  data () {
    return {
      wordForm: ""
    }
  },
  methods: {
    async giveSuggestion () {
      EventBus.$emit('inflectionResultEvent', await backend.inflectLike(this.wordForm, this.like))
    }
  }
}
</script>

<style scoped>
div {
  margin-top: 20px;
}
</style>
