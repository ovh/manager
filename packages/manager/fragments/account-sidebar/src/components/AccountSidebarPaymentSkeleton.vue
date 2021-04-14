<template>
  <div class="manager-hub-payment-mean">
    <a class="d-flex flex-row align-items-center p-2 ng-isolate-scope">
      <img aria-hidden="true" class="mr-1 ng-scope" />
      <div class="m-auto p-1 minw-0 w-100">
        <h3 data-translate="hub_payment_mean_title">
          <div class="oui-skeleton oui-skeleton_s"><span class="oui-skeleton__loader"></span></div>
        </h3>
        <div class="manager-hub-payment-mean_label">
          <div class="m-0 oui-skeleton oui-skeleton_xs">
            <span class="oui-skeleton__loader"></span>
          </div>
          <badge class="manager-hub-payment-mean_status"></badge>
        </div>
      </div>
      <span class="ml-auto oui-icon oui-icon-arrow-right" aria-hidden="true"> </span>
    </a>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue';

export default defineComponent({
  components: {
    Badge: defineAsyncComponent(() => import('@/components/ui/Badge')),
  },
});
</script>

<style lang="scss" scoped>
@import '../styles/account-sidebar-payment.scss';
</style>
