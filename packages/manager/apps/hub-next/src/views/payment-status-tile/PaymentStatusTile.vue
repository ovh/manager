<template>
  <tile
    :title="t('ovh_manager_hub_payment_status_tile_title')"
    :count="billingServices.count"
    :link="buildURL('dedicated', '#/billing/autorenew')"
  >
    <template #body>
      <data-table :rows="billingServicesCellValues"></data-table>
    </template>
  </tile>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent, Ref, ref } from 'vue';
import axios from 'axios';
import { buildURL } from '@ovh-ux/ufrontend/url-builder';
import Badge from '@/components/ui/Badge';
import Dropdown from '@/components/ui/Dropdown.vue';
import BillingServiceClass from '@/models/classes/BillingService.class';
import { BillingService, BillingServicesObject } from '@/models/hub.d';
import { useI18n } from 'vue-i18n';
import useLoadTranslations from '@/composables/useLoadTranslations';

import { SERVICE_STATES } from '@/constants/service_states';

export default defineComponent({
  async setup() {
    const { t, locale, d } = useI18n();
    const translationFolders = ['products', 'payment-status-tile', 'billing'];
    await useLoadTranslations(translationFolders);
    const billingServices: Ref<BillingServicesObject> = ref({} as BillingServicesObject);
    const response = await axios.get('/engine/2api/hub/billingServices');
    billingServices.value = response.data.data.billingServices.data;

    return {
      t,
      locale,
      d,
      billingServices,
    };
  },
  components: {
    Tile: defineAsyncComponent(() => import('@/components/ui/Tile.vue')),
    DataTable: defineAsyncComponent(() => import('@/components/ui/DataTable.vue')),
  },
  computed: {
    billingServicesCellValues(): Array<Record<string, any>> {
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
          [
            {
              tag: Dropdown,
              attrs: {
                // TODO: fetch links
                entries: ['First entry', 'Second entry', 'Last entry'],
              },
              value: [
                {
                  tag: 'button',
                  attrs: {
                    class: 'oui-action-button oui-dropdown__trigger',
                  },
                  value: [
                    {
                      tag: 'span',
                      attrs: {
                        class: 'oui-icon oui-icon-ellipsis',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        ];
      });
    },
  },
  methods: {
    buildURL,
    getServiceStateClass(service: BillingService): string {
      const billingService = new BillingServiceClass(service);

      if (SERVICE_STATES.error.includes(billingService.getRenew()) || billingService.hasDebt())
        return 'error';

      if (SERVICE_STATES.warning.includes(billingService.getRenew())) return 'warning';

      if (SERVICE_STATES.success.includes(billingService.getRenew())) return 'success';

      return '';
    },
    getStateText(service: BillingService): string {
      const billingService = new BillingServiceClass(service);
      const dateLocale = this.locale.replace('_', '-');
      if (
        billingService.hasManualRenew() &&
        !billingService.isResiliated() &&
        !billingService.hasDebt()
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
        billingService.hasAutomaticRenew() &&
        !billingService.isOneShot() &&
        !billingService.hasDebt() &&
        !billingService.hasPendingResiliation()
      ) {
        return this.d(billingService.expirationDate, 'short', dateLocale);
      }

      if (billingService.hasDebt()) {
        return this.t('ovh_manager_hub_payment_status_tile_now');
      }

      return '';
    },
  },
});
</script>
