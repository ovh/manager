<template>
  <tile
    class="manager-hub-billing-summary"
    text-color="white"
    :title="t('hub_billing_summary_title')"
    :is-shadowed="false"
  >
    <template #body>
      <oui-select
        @select-option="refreshBills($event)"
        :selected-option="selectedOption"
        :options="filterDatesOptions"
      ></oui-select>
      <span class="manager-hub-billing-summary__bill-total">
        {{ `${bills.total} ${bills.currency.symbol}` }}
      </span>
      <p
        v-if="bills.total && debt.dueAmount.value === 0"
        class="manager-hub-billing-summary__bill-status"
      >
        <span class="oui-icon align-middle mr-2 oui-icon-success-circle"></span>
        <span> {{ t('hub_billing_summary_debt_null') }} </span>
      </p>
      <p v-if="debt.dueAmount.value">
        <span> {{ t('hub_billing_summary_debt', { debt: debt.dueAmount.text }) }} </span>
        <a class="d-block" target="_blank" rel="noopener">
          {{ t('hub_billing_summary_debt_pay') }}
        </a>
      </p>
      <p v-if="bills.total === 0" class="mt-3">
        {{ t('hub_billing_summary_debt_no_bills') }}
      </p>

      <a :href="billingHistoryURL" class="oui-button oui-button_primary oui-button_icon-right">
        <span> {{ t('hub_billing_summary_display_bills') }} </span>
        <span class="oui-icon oui-icon-arrow-right"></span>
      </a>
    </template>
  </tile>
</template>

<script lang="ts">
import {
  defineAsyncComponent, defineComponent, computed, ref,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { buildURL } from '@ovh-ux/ufrontend/url-builder';
import { mapGetters, useStore } from 'vuex';
import OuiSelect from '@/components/ui/OuiSelect.vue';
import axios from 'axios';

export default defineComponent({
  setup() {
    const { t } = useI18n();
    const store = useStore();
    const selectedOption = ref(1);
    const filterDatesOptions = computed(() => [
      {
        key: 1,
        value: t('hub_billing_summary_period_1'),
      },
      {
        key: 3,
        value: t('hub_billing_summary_period_3'),
      },
      {
        key: 6,
        value: t('hub_billing_summary_period_6'),
      },
    ]);
    return {
      t,
      store,
      filterDatesOptions,
      selectedOption,
    };
  },
  components: {
    Tile: defineAsyncComponent(() => import('@/components/ui/Tile.vue')),
    OuiSelect,
  },
  computed: {
    ...mapGetters({
      bills: 'getBills',
      debt: 'getDebt',
    }),
    billingHistoryURL(): string {
      return this.buildURL('dedicated', '#/billing/history');
    },
  },
  methods: {
    buildURL,
    refreshBills(billKey: number): void {
      this.selectedOption = billKey;
      axios.get(`/engine/2api/hub/bills?billingPeriod=${billKey}`).then((data) => {
        this.store.commit('setBills', data.data.data.bills.data);
      });
    },
  },
});
</script>

<style lang="scss" scoped>
@import '@ovh-ux/manager-hub/src/variables.scss';

@mixin manager-hub-billing-summary {
  $bg-color: $p-300;
  $bg-image: url('../../assets/billing-background.svg');

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
</style>
