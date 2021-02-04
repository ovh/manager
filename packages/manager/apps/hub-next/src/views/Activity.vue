<template>
  <tile
    class="col-md-8 mb-3 mb-md-4"
    :title="t('ovh_manager_hub_payment_status_tile_title')"
    :count="billingServices.data.length"
    :link="{ path: '/' }"
  >
    <template #body>
      <data-table :rows="billingServicesCellValues"></data-table>
    </template>
  </tile>
  <div class="col-md-4 mb-3 mb-md-4 order-3 order-md-2">
    <tile
      class="manager-hub-billing-summary"
      :title="t('hub_billing_summary_title')"
      :is-shadowed="false"
      color="white"
    >
      <template #body>
        <span class="manager-hub-billing-summary__bill-total">
          {{ `${bills.total} ${bills.currency.symbol}` }}</span
        >
      </template>
    </tile>
  </div>
  <tile
    class="col-md-8 mb-3 mb-md-4 order-2 order-md-3"
    :title="t('hub_support_title')"
    :count="support.data.length"
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
    <tile
      class="manager-hub-order-tracking"
      :title="t('hub_order_tracking_title')"
      :is-shadowed="false"
    >
      <template #body>
        <div>
          <badge
            class="mb-2"
            html-tag="a"
            :href="lastOrder.url"
            :text-content="`N° ${lastOrder.orderId}`"
          ></badge>
        </div>
      </template>
    </tile>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue';
import { BillingService, SupportDemand } from '@/models/hub.d';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { mapGetters } from 'vuex';
import Badge from '@/components/ui/Badge.vue';

export default defineComponent({
  setup() {
    const { t } = useI18n();
    const router = useRouter();
    return {
      t,
      router,
    };
  },
  components: {
    Tile: defineAsyncComponent(() => import('@/components/ui/Tile.vue')),
    DataTable: defineAsyncComponent(() => import('@/components/ui/DataTable.vue')),
    Badge,
  },
  computed: {
    ...mapGetters({
      bills: 'getBills',
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
        this.t(`hub_support_state_${ticket.state}`),
        [
          {
            tag: 'a',
            attrs: {
              href: `https://www.ovh.com/manager/dedicated/#/support/tickets/${ticket.ticketId}`,
            },
            value: this.t('hub_support_read'),
          },
        ],
      ]);
    },
    billingServicesCellValues(): [] {
      return this.billingServices.data.map((billingService: BillingService) => [
        [
          { tag: 'a', attrs: { href: billingService.url }, value: billingService.domain },
          { tag: 'div', value: this.t(`manager_hub_products_${billingService.serviceType}`) },
        ],
      ]);
    },
  },
});
</script>

<style lang="scss" scoped>
@import '@ovh-ux/manager-hub/src/variables.scss';

@mixin manager-hub-billing-summary {
  $bg-color: $p-300;
  $bg-image: url('../assets/billing-background.svg');

  background-color: $bg-color;
  background-image: $bg-image;
  background-repeat: no-repeat;
  background-size: cover;
  color: $p-000-white;
  font-weight: 600;
  text-align: center;
  border-radius: $hub-tile-border-radius;
  padding: $hub-tile-padding;
  width: 100%;

  > h3 {
    color: $p-000-white;
  }

  &__billing-link {
    margin-top: 1rem;
  }

  .oui-icon {
    color: $p-000-white;
  }

  p,
  span {
    > a {
      color: $p-000-white;
      margin-bottom: -1.5rem;
      text-decoration: underline !important;
    }
  }

  .oui-ui-select {
    width: 100%;
    max-width: 15rem;
    margin: auto;
    padding: 0 1rem;

    .ui-select-match {
      &,
      &:hover,
      &:focus,
      &[aria-expanded="'true'"] {
        background-color: transparent;
        border-color: $p-000-white;
        border-width: 2px;
        border-radius: 0.25rem;
        color: $p-000-white;
        font-weight: 600;

        .ui-select-match-icon {
          color: inherit;
        }
      }
    }

    .ui-select-dropdown {
      background-color: $bg-color;
      border: 2px solid $p-000-white;
      border-top: none;
      width: calc(100% - 2rem);
      left: 1rem;

      .ui-select-choices-row {
        color: $p-000-white;
        background-color: transparent;
        font-weight: 600;

        &:hover {
          color: $p-000-white;
          background-color: $p-700;
        }
      }
    }
  }

  &__bill-total {
    font-weight: 600;
    font-size: calc(2rem + 1vw);
    white-space: nowrap;
    display: block;
  }

  &__bill-status .oui-icon {
    font-size: 1.5rem;
  }
}

.manager-hub-billing-summary {
  @include manager-hub-billing-summary;
}

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
