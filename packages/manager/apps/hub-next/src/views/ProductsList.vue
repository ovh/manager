<template>
  <tile
    v-for="(service, name) in services.data"
    :key="name"
    class="col-md-6 col-lg-4 mb-2 mb-md-4 oui-list"
    :title="t(`manager_hub_products_${name}`)"
    :count="service.data.length"
    :link="{
      path: '/product-details',
      query: { productApiUrl: getRouteQueryApiUrl(service.data[0].route.path) },
    }"
  >
    <template #body>
      <ul class="oui-list__items">
        <li
          v-for="details in service.data.slice(0, maxItemsPerProduct)"
          class="oui-list__item"
          :key="details.serviceId"
        >
          <a href="">{{ details.resource.displayName }}</a>
        </li>
      </ul>
    </template>
  </tile>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { mapGetters } from 'vuex';

export default defineComponent({
  setup() {
    const { t } = useI18n();
    return {
      t,
    };
  },
  props: {
    maxItemsPerProduct: {
      type: Number,
      default: 4,
    },
  },
  components: {
    Tile: defineAsyncComponent(() => import('@/components/ui/Tile.vue')),
  },
  computed: {
    ...mapGetters({
      services: 'getServices',
    }),
  },
  methods: {
    getRouteQueryApiUrl(url: string): string {
      if (url.indexOf('{') < 0) return url;

      return url.replace(/\{(.*?)\}/, '');
    },
  },
});
</script>

<style scoped></style>
