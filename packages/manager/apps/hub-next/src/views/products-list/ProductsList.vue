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
  <div class="centered-button">
    <button
      v-if="servicesLength"
      @click="
        changeProductsListSize(areAllProductsShown ? PRODUCTS_TO_SHOW_DEFAULT : servicesLength)
      "
      class="oui-button oui-button_icon-right oui-button_ghost"
    >
      <span>
        {{
          areAllProductsShown
            ? t('manager_hub_products_see_less')
            : t('manager_hub_products_see_more')
        }}
      </span>
    </button>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { PRODUCTS_TO_SHOW_DEFAULT } from '@/constants/products_consts';
import axios from 'axios';
import { HubResponse, Services } from '@/models/hub.d';
import useLoadTranslations from '@/composables/useLoadTranslations';

export default defineComponent({
  async setup() {
    const { t } = useI18n();
    const translationFolders = ['products'];
    await useLoadTranslations(translationFolders);

    const servicesResponse = await axios.get<HubResponse>('/engine/2api/hub/services');
    const services: Services = servicesResponse.data.data.services.data;

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
  },
  data() {
    return {
      PRODUCTS_TO_SHOW_DEFAULT,
      maxProductsToShow: PRODUCTS_TO_SHOW_DEFAULT,
    };
  },
  components: {
    Tile: defineAsyncComponent(() => import('@/components/ui/Tile.vue')),
  },
  computed: {
    formattedServices(): Array<{}> {
      return Object.keys(this.services?.data).map((key) => ({
        serviceName: key,
        ...this.services?.data[key],
      }));
    },
    slicedServices(): Array<{}> {
      return this.formattedServices.slice(0, this.maxProductsToShow);
    },
    areAllProductsShown(): boolean {
      return this.maxProductsToShow !== PRODUCTS_TO_SHOW_DEFAULT;
    },
    servicesLength(): number {
      return this.services?.data ? Object.keys(this.services?.data).length : 0;
    },
  },
  methods: {
    getRouteQueryApiUrl(url: string): string {
      if (url.indexOf('{') < 0) return url;

      return url.replace(/\{(.*?)\}/, '');
    },
    changeProductsListSize(numberOfProducts: number): void {
      this.maxProductsToShow = numberOfProducts;
    },
  },
});
</script>

<style lang="scss" scoped>
.centered-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
