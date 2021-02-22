<template>
  <tile class="billing-summary-dummy" :is-shadowed="false" title=" ">
    <template #body>
      <div class="billing-summary-dummy-body">
        <div class="oui-skeleton oui-skeleton_m">
          <span class="oui-skeleton__loader"></span>
        </div>
        <div class="oui-skeleton oui-skeleton_s">
          <span class="oui-skeleton__loader"></span>
        </div>
        <div class="oui-skeleton oui-skeleton_m">
          <span class="oui-skeleton__loader"></span>
        </div>
        <a class="oui-button oui-button_primary oui-button_icon-right">
          <div class="oui-skeleton oui-skeleton_s">
            <span class="oui-skeleton__loader"></span>
          </div>
        </a>
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
.billing-summary-dummy {
  background-color: #2095ef;
  height: 90%;
  border-radius: 0.8rem;

  .billing-summary-dummy-body {
    padding: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .oui-skeleton {
      line-height: 4rem;
    }

    .oui-button {
      .oui-skeleton {
        line-height: inherit;
      }
    }
  }
}
</style>
