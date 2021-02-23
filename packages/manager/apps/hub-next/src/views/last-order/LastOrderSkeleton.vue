<template>
  <tile title=" " class="manager-hub-order-tracking" :is-shadowed="false">
    <template #body>
      <badge class="mb-2" html-tag="a" value="----------"></badge>
      <div class="mb-3 d-flex justify-content-center flex-wrap">
        <div class="oui-skeleton oui-skeleton_l">
          <span class="oui-skeleton__loader"></span>
        </div>
      </div>
      <a class="oui-button oui-button_primary oui-button_icon-right">
        <span class="oui-skeleton oui-skeleton_s">
          <span class="oui-skeleton__loader"></span>
        </span>
      </a>
    </template>
  </tile>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue';

export default defineComponent({
  components: {
    Tile: defineAsyncComponent(() => import('@/components/ui/Tile.vue')),
    Badge: defineAsyncComponent(() => import('@/components/ui/Badge.ts')),
  },
});
</script>

<style lang="scss" scoped>
.manager-hub-order-tracking {
  @import '~bootstrap/scss/_functions';
  @import '~bootstrap/scss/_variables';
  @import '~bootstrap/scss/_mixins';
  @import '~bootstrap/scss/_utilities.scss';
  @import '@ovh-ux/manager-hub/src/variables.scss';
  @import '@ovh-ux/ui-kit/dist/scss/_tokens';

  background-color: $p-200;
  color: $p-800;
  text-align: center;
  border-radius: $hub-tile-border-radius;
  padding: 1rem;

  .oui-skeleton {
    margin: 1rem 0;
  }

  .oui-button {
    .oui-skeleton {
      margin: inherit;
    }
  }

  &__button {
    margin-top: 1rem;
  }

  a.oui-badge {
    line-height: 1rem;
    display: inline-block;
    padding: 0.25rem 0.5rem;
    text-decoration: none;
    font-size: 0.75rem;
    background-color: $p-100;

    &:hover {
      background-color: $p-075;
    }
  }
}
</style>
