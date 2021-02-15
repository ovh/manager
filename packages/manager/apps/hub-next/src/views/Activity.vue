<template>
  <tile
    class="col-md-8 mb-3 mb-md-4"
    :title="t('ovh_manager_hub_payment_status_tile_title')"
    :count="billingServices.count"
    :link="buildURL('dedicated','#/billing/autorenew')"
  >
    <template #body>
      <data-table :rows="billingServicesCellValues"></data-table>
    </template>
  </tile>
  <div class="col-md-4 mb-3 mb-md-4 order-3 order-md-2">
    <billing-summary-tile></billing-summary-tile>
  </div>
  <tile
    class="col-md-8 mb-3 mb-md-4 order-2 order-md-3"
    :title="t('hub_support_title')"
    :count="support.data.length"
    :link="support.data ? buildURL('dedicated','#/ticket') : ''"
  >
    <template #body>
      <data-table v-if="support.data.length" :rows="supportCellValues"></data-table>
      <div v-else>
        <div class="manager-hub-support__illustration"></div>
        <h3 class="oui-heading_4">{{ t('hub_support_need_help') }}</h3>
        <p>{{ t('hub_support_need_help_more') }}</p>
        <a href="" class="manager-hub-support__link">
          <span>{{ t('hub_support_help') }}</span>
          <span class="oui-icon oui-icon-arrow-right"></span>
        </a>
      </div>
    </template>
  </tile>
  <div class="col-md-4 order-4">
    <last-order-tile></last-order-tile>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue';
import { BillingService, SupportDemand } from '@/models/hub.d';
import { buildURL } from '@ovh-ux/ufrontend/url-builder';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { mapGetters } from 'vuex';
import format from 'date-fns/format';
import Badge from '@/components/ui/Badge.vue';
import BillingServiceClass from '@/models/classes/BillingService.class';
import { SERVICE_STATES } from '../constants/service_states';

export default defineComponent({
  setup() {
    const { t, d, locale } = useI18n();
    const router = useRouter();
    return {
      t,
      d,
      router,
      locale,
    };
  },
  components: {
    Tile: defineAsyncComponent(() => import('@/components/ui/Tile.vue')),
    DataTable: defineAsyncComponent(() => import('@/components/ui/DataTable.vue')),
    LastOrderTile: defineAsyncComponent(() => import('@/views/last-order/LastOrderTile.vue')),
    BillingSummaryTile: defineAsyncComponent(() => import('@/views/billing-summary/BillingSummaryTile.vue')),
  },
  computed: {
    ...mapGetters({
      billingServices: 'getBillingServices',
      support: 'getSupport',
      lastOrder: 'getLastOrder',
    }),
    supportCellValues(): [] {
      return this.support.data.map((ticket: SupportDemand) => [
        [
          {
            tag: 'span',
            attrs: {
              class: 'font-weight-bold',
            },
            value: ticket?.serviceName
              ? ticket.serviceName
              : this.t('hub_support_account_management'),
          },
        ],
        ticket.subject,
        [
          {
            tag: Badge,
            attrs: {
              level: this.getStateCategory(ticket),
              textContent: this.t(`hub_support_state_${ticket.state}`),
            },
          },
        ],
        [
          {
            tag: 'a',
            attrs: {
              target: '_blank',
              href: this.buildURL('dedicated', `#/support/tickets/${ticket.ticketId}`),
            },
            value: this.t('hub_support_read'),
          },
        ],
      ]);
    },
    billingServicesCellValues(): [] {
      return this.billingServices.data.map((billing: BillingService) => {
        const billingService = new BillingServiceClass(billing);
        return [
          [
            {
              tag: 'a',
              attrs: { class: 'oui-link', href: billingService.url },
              value: billingService.domain,
            },
            {
              tag: 'p',
              attrs: { class: 'mb-0 hub-payment-status_small ' },
              value: this.t(`manager_hub_products_${billingService.serviceType}`),
            },
          ],
          [
            {
              tag: Badge,
              attrs: {
                level: this.getServiceStateClass(billingService),
                textContent: this.t(
                  `manager_billing_service_status_${
                    billingService.status === 'OK'
                      ? billingService.getRenew()
                      : billingService.status.toLowerCase()
                  }`,
                ),
              },
            },
            {
              tag: 'div',
              value: this.getStateText(billing),
            },
          ],
        ];
      });
    },
  },
  methods: {
    getServiceStateClass(service: BillingService): string {
      const billingService = new BillingServiceClass(service);

      if (SERVICE_STATES.error.includes(billingService.getRenew()) || billingService.hasDebt()) return 'error';

      if (SERVICE_STATES.warning.includes(billingService.getRenew())) return 'warning';

      if (SERVICE_STATES.success.includes(billingService.getRenew())) return 'success';

      return '';
    },
    format,
    getStateCategory(ticket: SupportDemand) {
      switch (ticket.state) {
        case 'open':
          return 'success';
        case 'closed':
          return 'info';
        case 'unknown':
          return 'warning';
        default:
          return 'error';
      }
    },
    getStateText(service: BillingService): string {
      const billingService = new BillingServiceClass(service);
      const dateLocale = this.locale.replace('_', '-');
      if (
        billingService.hasManualRenew()
        && !billingService.isResiliated()
        && !billingService.hasDebt()
      ) {
        return this.t('ovh_manager_hub_payment_status_tile_before', {
          date: this.d(billingService.expirationDate, 'short', dateLocale),
        });
      }

      if (billingService.isResiliated() || billingService.hasPendingResiliation()) {
        return this.t('ovh_manager_hub_payment_status_tile_renew', {
          date: this.d(billingService.expirationDate, 'short', dateLocale),
        });
      }

      if (
        billingService.hasAutomaticRenew()
        && !billingService.isOneShot()
        && !billingService.hasDebt()
        && !billingService.hasPendingResiliation()
      ) {
        return this.d(billingService.expirationDate, 'short', dateLocale);
      }

      if (billingService.hasDebt()) {
        return this.t('ovh_manager_hub_payment_status_tile_now');
      }

      return '';
    },
    buildURL,
  },
});
</script>

<style lang="scss" scoped>
.manager-hub-support {
  @import 'bootstrap4/scss/_functions.scss';
  @import 'bootstrap4/scss/_variables.scss';
  @import 'bootstrap4/scss/_mixins.scss';
  @import 'bootstrap4/scss/_utilities.scss';
  @import '~@ovh-ux/manager-hub/src/variables.scss';

  h3 {
    display: inline-block;
  }

  &_count {
    @include hub-pill;
  }

  &_more {
    float: right;
    margin-top: 0.25rem;
  }

  &__illustration {
    background-image: url('../assets/assistance.png');
    background-repeat: no-repeat;
    height: 10rem;
    background-position: center;
  }

  &__link .oui-icon {
    font-size: 0.75rem;
    margin-left: 0.25rem;
  }
}
</style>
