<template>
  <bryntum-button id="Binvoice" text="Create Invoice" v-on:click="createInvoice()">
  </bryntum-button>

  <bryntum-grid ref="grid" v-bind="gridConfig" :data="data" @click="cellClick()" />
</template>

<script>
import { ref, reactive } from 'vue';

import {
  BryntumGrid, BryntumButton
} from '@bryntum/grid-vue-3';

import { useGridConfig } from '@/AppConfig';

export default {
  name: 'App',

  components: {
    BryntumGrid,
    BryntumButton
  },

  setup() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const projectId = urlParams.get('project_id');

    const grid = ref(null);
    const gridConfig = reactive(useGridConfig(projectId));
    const data = ref(null);

    const cellClick = () => {
      const columnsHide = grid.value.instance.value;
      for (let i = 0; i < columnsHide.store.data.length; i++) {
        const ta_qty = columnsHide.store.getAt(i).get('ta_qty');
        const ta_value = columnsHide.store.getAt(i).get('ta_value');
        if (ta_value) columnsHide.store.getAt(i).set({ 'ta_qty': 100 * columnsHide.store.getAt(i).get('ta_value') / columnsHide.store.getAt(i).get('lineScheduledValue') })
        if (ta_qty) columnsHide.store.getAt(i).set({ 'ta_value': columnsHide.store.getAt(i).get('lineScheduledValue') * columnsHide.store.getAt(i).get('ta_qty') / 100 })
      }
    }

    return {
      grid,
      gridConfig,
      cellClick,
      data
    };
  },

  methods: {
    createInvoice() {
      const grid = this.$refs.grid.instance.value;
      if (grid.selectedRecord) {
        alert(grid.selectedRecord.data._id)
      } else {
        alert("Choose the ID");
      }
    }
  },
};
</script>

<style lang="scss">
@import './App.scss';
</style>