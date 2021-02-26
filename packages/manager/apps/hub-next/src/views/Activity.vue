<template>
  <div class="col-md-8 mb-3 mb-md-4">
    <Suspense>
      <template #default>
        <payment-status-tile></payment-status-tile>
      </template>
      <template #fallback>
        <payment-status-skeleton></payment-status-skeleton>
      </template>
    </Suspense>
  </div>
  <div class="col-md-4 mb-3 mb-md-4 order-3 order-md-2">
    <Suspense>
      <template #default>
        <billing-summary-tile></billing-summary-tile>
      </template>
      <template #fallback>
        <billing-summary-skeleton></billing-summary-skeleton>
      </template>
    </Suspense>
  </div>
  <div class="col-md-8 mb-3 mb-md-4 order-2 order-md-3">
    <Suspense>
      <template #default>
        <support-tile></support-tile>
      </template>
      <template #fallback>
        <support-tile-skeleton></support-tile-skeleton>
      </template>
    </Suspense>
  </div>
  <div class="col-md-4 order-4">
    <Suspense>
      <template #default>
        <last-order-tile></last-order-tile>
      </template>
      <template #fallback>
        <last-order-skeleton></last-order-skeleton>
      </template>
    </Suspense>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { Environment } from '@ovh-ux/manager-config';
import LastOrderSkeleton from '@/views/last-order/LastOrderSkeleton.vue';
import BillingSummarySkeleton from '@/views/billing-summary/BillingSummarySkeleton.vue';
import SupportTileSkeleton from '@/views/support-tile/SupportTileSkeleton.vue';
import PaymentStatusSkeleton from '@/views/payment-status-tile/PaymentStatusSkeleton.vue';
import BillingSummaryTile from '@/views/billing-summary/BillingSummaryTile.vue';
import PaymentStatusTile from '@/views/payment-status-tile/PaymentStatusTile.vue';
import LastOrderTile from '@/views/last-order/LastOrderTile.vue';
import SupportTile from '@/views/support-tile/SupportTile.vue';

export default defineComponent({
  setup() {
    const { t, d, locale } = useI18n();
    const router = useRouter();
    const userLanguage = computed(() => Environment.getUserLanguage());

    return {
      t,
      d,
      router,
      locale,
      userLanguage,
    };
  },
  components: {
    LastOrderTile,
    BillingSummaryTile,
    PaymentStatusTile,
    SupportTile,
    PaymentStatusSkeleton,
    SupportTileSkeleton,
    BillingSummarySkeleton,
    LastOrderSkeleton,
  },
});
</script>
