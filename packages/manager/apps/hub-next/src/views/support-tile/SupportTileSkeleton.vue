<template>
  <tile title=" ">
    <template #body>
      <div class="custom-skeleton-header oui-skeleton oui-skeleton_s">
        <span class="oui-skeleton__loader"></span>
      </div>
      <div class="oui-skeleton oui-skeleton_m">
        <span class="oui-skeleton__loader"></span>
      </div>
      <div class="oui-skeleton oui-skeleton_xl">
        <span class="oui-skeleton__loader"></span>
      </div>
    </template>
  </tile>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue';

export default defineComponent({
  components: {
    Tile: defineAsyncComponent(() => import('@/components/ui/Tile.vue')),
  },
});
</script>
<style lang="scss" scoped>
.custom-skeleton-header {
  line-height: 3rem;
}
</style>
