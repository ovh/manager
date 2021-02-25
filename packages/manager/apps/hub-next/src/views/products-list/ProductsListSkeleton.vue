<template>
  <tile
    v-for="service in fakeServices"
    :key="service"
    title=" "
    class="col-md-6 col-lg-4 mb-2 mb-md-4 oui-list"
  >
    <template #body>
      <ul class="oui-list__items">
        <li v-for="details in fakeProducts" class="oui-list__item" :key="details">
          <div class="oui-skeleton oui-skeleton_m">
            <span class="oui-skeleton__loader"></span>
          </div>
        </li>
      </ul>
    </template>
  </tile>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue';

export default defineComponent({
  setup() {
    const fakeServices = Array.from({ length: 6 });
    const fakeProducts = Array.from({ length: 4 });
    return {
      fakeServices,
      fakeProducts,
    };
  },
  components: {
    Tile: defineAsyncComponent(() => import('@/components/ui/Tile.vue')),
  },
});
</script>
