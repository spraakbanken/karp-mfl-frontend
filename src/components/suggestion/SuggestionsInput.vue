<template>
  <div>
    <b-tabs>
      <b-tab :title="loc('bywordform')" active>
        <ByWordForm class="input-method" :pos-tags="posTags" :globals="globals" @router="update" />
      </b-tab>
      <b-tab :title="loc('byword')">
        <ByWord class="input-method" :globals="globals" @router="update" />
      </b-tab>
      <b-tab :title="loc('bycategory')">
        <ByCategory class="input-method" :globals="globals" @router="update" />
      </b-tab>
      <b-tab :title="loc('bytable')">
        <ByTable class="input-method" :pos-tags="posTags" :globals="globals" @router="update" />
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import mix from '@/mix'
import ByWordForm from './ByWordForm'
import ByWord from './ByWord'
import ByCategory from './ByCategory'
import ByTable from './ByTable'
import backend from '@/services/backend'

export default {
  mixins: [mix],
  name: 'SuggestionsMain',
  components: {
    ByWordForm,
    ByWord,
    ByCategory,
    ByTable
  },
  data () {
    return {
      posTags: []
    }
  },
  mounted: async function () {
    this.posTags = await backend.getPosTags(this.globals.hot.lexicon)
  }
}
</script>

<style>
.input-method {
  padding: 20px;
}
.input-method > * {
  padding: 5px;
  /*border: 1px solid black;*/
}
</style>
