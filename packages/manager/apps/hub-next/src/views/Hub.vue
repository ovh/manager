<template>
  <div class="hub-dashboard-content">
    <hub-section :title="t('manager_hub_dashboard_overview')">
      <!-- TODO: refactor into proper business components  -->
      <template #content>
        <tile
          class="col-md-8 mb-3 mb-md-4"
          :title="t('ovh_manager_hub_payment_status_tile_title')"
          :count="billingServices.data.length"
        >
          <template #body>
            <table>
              <tr v-for="billingService in billingServices.data" :key="billingService.id">
                <td>
                  <a href="">{{ billingService.domain }}</a>
                  <div>{{ t(`manager_hub_products_${billingService.serviceType}`) }}</div>
                </td>
                <td></td>
                <td></td>
              </tr>
            </table>
          </template>
        </tile>
        <tile
          class="col-md-4 mb-3 mb-md-4 order-3 order-md-2"
          :title="t('hub_billing_summary_title')"
        >
          <template #body>
            <span>TextToFill</span>
          </template>
        </tile>
        <tile
          class="col-md-8 mb-3 mb-md-4 order-2 order-md-3"
          :title="t('hub_support_title')"
          :count="support.data.length"
        >
          <template #body>
            <div class="oui-table-responsive">
              <table class="oui-table">
                <tr class="oui-table__row" v-for="ticket in support.data" :key="ticket.ticketId">
                  <td class="oui-table__cell">
                    {{
                      ticket?.serviceName
                        ? ticket?.serviceName.toUpperCase()
                        : t('hub_support_account_management')
                    }}
                  </td>
                  <td class="oui-table__cell">{{ ticket.subject }}</td>
                  <td class="oui-table__cell">{{ t(`hub_support_state_${ticket.state}`) }}</td>
                  <td class="oui-table__cell"></td>
                </tr>
              </table>
            </div>
          </template>
        </tile>
        <tile class="col-md-4 order-4" :title="t('hub_order_tracking_title')">
          <template #body>
            <span>N° {{ lastOrder.orderId }}</span>
            <b></b>
          </template>
        </tile>
      </template>
    </hub-section>
    <hub-section :title="t('manager_hub_dashboard_services')">
      <template #content>
        <tile
          v-for="(service, name) in services.data"
          :key="name"
          class="col-md-6 col-lg-4 mb-2 mb-md-4 oui-list"
          :title="t(`manager_hub_products_${name}`)"
          :count="service.data.length"
        >
          <template #body>
            <ul class="oui-list__items">
              <li
                v-for="details in service.data.slice(0, 4)"
                class="oui-list__item"
                :key="details.serviceId"
              >
                <a href="">{{ details.resource.displayName }}</a>
              </li>
            </ul>
          </template>
        </tile>
      </template>
    </hub-section>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue';
import { mapGetters, useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  async setup() {
    const { locale, t } = useI18n();
    const store = useStore();
    await store.dispatch('fetchHubData');
    return {
      t,
      locale,
      store,
    };
  },
  components: {
    HubSection: defineAsyncComponent(() => import('@/components/HubSection.vue')),
    Tile: defineAsyncComponent(() => import('@/components/ui/Tile.vue')),
  },
  computed: {
    ...mapGetters({
      // 'getBills',
      billingServices: 'getBillingServices',
      // 'getCatalog',
      // 'getCertificates',
      // 'getDebt',
      lastOrder: 'getLastOrder',
      // 'getUser',
      // 'getNotifications',
      // 'getPaymentMethods',
      services: 'getServices',
      support: 'getSupport',
      // 'getSupportLevel',
    }),
  },
});
</script>

<style lang="scss" scoped>
.hub-dashboard-content {
  padding-bottom: 3rem;
}

.hub-banner {
  background-color: #f5feff;
  color: #4d5592;
  padding: 0.5rem 1rem;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;

  + .hub-dashboard-content {
    margin-top: 2.5rem;
  }
}

.hub-dashboard-product {
  margin-top: 2.5rem;
}
</style>
