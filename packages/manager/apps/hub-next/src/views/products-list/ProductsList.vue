<template>
  <tile
    v-for="service in slicedServices"
    :key="service.serviceName"
    :title="t(`manager_hub_products_${service.serviceName}`)"
    :count="service.count"
    :link="{
      path: '/product-details',
      query: {
        productApiUrl: getRouteQueryApiUrl(service.data[0].route.path),
        productName: t(`manager_hub_products_${service.serviceName}`),
      },
    }"
    class="col-md-6 col-lg-4 mb-2 mb-md-4 oui-list"
  >
    <template #body>
      <ul class="oui-list__items">
        <li
          v-for="details in service.data.slice(0, maxItemsPerProduct)"
          class="oui-list__item"
          :key="details.serviceId"
        >
          <a :href="details.url" target="_blank">{{ details.resource.displayName }}</a>
        </li>
      </ul>
    </template>
  </tile>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { PRODUCTS_TO_SHOW_DEFAULT } from '@/constants/products_consts';
import axios from 'axios';
import { useStore } from 'vuex';

export default defineComponent({
  async setup() {
    const { t } = useI18n();
    const store = useStore();
    const servicesResponse = await axios.get('/engine/2api/hub/services');
    const services = ref(servicesResponse.data.data.services.data);
    store.commit('setServices', services);

    return {
      t,
      services,
    };
  },
  props: {
    maxItemsPerProduct: {
      type: Number,
      default: 4,
    },
    maxProductsToShow: {
      type: Number,
      default: PRODUCTS_TO_SHOW_DEFAULT,
    },
  },
  components: {
    Tile: defineAsyncComponent(() => import('@/components/ui/Tile.vue')),
  },
  computed: {
    formattedServices(): Array<{}> {
      return Object.keys(this.services.data).map((key) => ({
        serviceName: key,
        ...this.services.data[key],
      }));
    },
    slicedServices(): Array<{}> {
      return this.formattedServices.slice(0, this.maxProductsToShow);
    },
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
