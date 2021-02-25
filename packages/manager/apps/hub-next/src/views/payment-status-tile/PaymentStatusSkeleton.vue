<template>
  <tile title=" ">
    <template #body>
      <data-table :rows="skeletonLoaderRows"></data-table>
    </template>
  </tile>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue';

export default defineComponent({
  setup() {
    const rows = Array.from({ length: 4 });
    const cols = Array.from({ length: 3 });

    const skeletonLoaderRows = rows.map(() =>
      cols.map(() => [
        {
          tag: 'div',
          attrs: { class: 'custom-cell oui-skeleton' },
          value: [
            {
              tag: 'span',
              attrs: { class: 'oui-skeleton__loader' },
            },
          ],
        },
      ]),
    );
    return {
      skeletonLoaderRows,
    };
  },
  components: {
    DataTable: defineAsyncComponent(() => import('@/components/ui/DataTable.vue')),
    Tile: defineAsyncComponent(() => import('@/components/ui/Tile.vue')),
  },
});
</script>

<style lang="scss">
.custom-cell {
  line-height: 3rem;
}
</style>
