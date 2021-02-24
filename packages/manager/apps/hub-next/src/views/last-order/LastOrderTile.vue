<template>
  <tile
    class="manager-hub-order-tracking"
    :title="t('hub_order_tracking_title')"
    :is-shadowed="false"
  >
    <template #body>
      <badge
        class="mb-2"
        html-tag="a"
        :href="lastOrder.url"
        :text-content="`N° ${lastOrder.orderId}`"
      ></badge>
      <div class="mb-3 d-flex justify-content-center flex-wrap">
        <span class="mr-1 font-weight-bold">
          {{ d(new Date(lastOrder.date), 'shortNumeric', formattedLocale) }}
        </span>
        <span class="mr-1">{{ t(`order_tracking_history_${status}`) }}</span>
        <span class="oui-icon" aria-hidden="true" :class="orderSuccessClassIcon"></span>
      </div>
      <a
        :href="buildURL('dedicated', '#/billing/orders')"
        class="oui-button oui-button_primary oui-button_icon-right"
      >
        <span> {{ t('hub_order_tracking_see_all') }} </span>
        <span class="oui-icon oui-icon-arrow-right"></span>
      </a>
    </template>
  </tile>
</template>

<script lang="ts">
import { ERROR_STATUS, WAITING_PAYMENT_LABEL } from '@/constants/order-tracking_consts';
import {
  computed, defineAsyncComponent, defineComponent, ref,
} from 'vue';
import { buildURL } from '@ovh-ux/ufrontend/url-builder';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import useLoadTranslations from '@/composables/useLoadTranslations';

export default defineComponent({
  async setup() {
    const { t, d, locale } = useI18n();
    const translationFolders = [
      'order-tracking',
      'ovh-order-tracking',
    ];
    await useLoadTranslations(translationFolders);
    const lastOrderResponse = await axios.get('/engine/2api/hub/lastOrder');
    const lastOrder = ref(lastOrderResponse.data.data.lastOrder.data);
    const orderStatus = await axios.get(`/engine/apiv6/me/order/${lastOrder.value?.orderId}/status`);
    const orderStatusData = ref(orderStatus.data);
    const status = computed(() => (orderStatusData.value === 'delivered' ? 'INVOICE_IN_PROGRESS' : 'custom_creation'));
    // // TODO: this is not correct, needs to fetch some other data from order url
    // // we should use buildURL, for now this will always return false
    const isWaitingPayment = computed(() => orderStatusData.value === WAITING_PAYMENT_LABEL);
    const formattedLocale = computed(() => locale.value.replace('_', '-'));

    return {
      status,
      t,
      isWaitingPayment,
      lastOrder,
      d,
      formattedLocale,
    };
  },
  components: {
    Tile: defineAsyncComponent(() => import('@/components/ui/Tile.vue')),
    Badge: defineAsyncComponent(() => import('@/components/ui/Badge')),
  },
  computed: {
    orderSuccessClassIcon(): string {
      if (ERROR_STATUS.includes(this.status)) {
        return 'oui-icon-close';
      }

      if (ERROR_STATUS.includes(this.status) && this.isWaitingPayment) {
        return 'oui-icon-ok';
      }

      return '';
    },
  },
  methods: {
    buildURL,
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
