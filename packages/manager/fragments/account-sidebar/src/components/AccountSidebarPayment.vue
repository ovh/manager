<template>
  <transition name="slide-down">
    <div v-if="defaultPaymentMean?.id" class="manager-hub-payment-mean">
      <a
        class="d-flex flex-row align-items-center p-2 ng-isolate-scope"
        :href="buildURL('dedicated', '#/billing/payment/method')"
      >
        <img aria-hidden="true" class="mr-1 ng-scope" :src="defaultPaymentMean?.icon?.data" />
        <div class="m-auto p-1 minw-0 w-100">
          <h3 data-translate="hub_payment_mean_title">{{ t('hub_payment_mean_title') }}</h3>
          <div class="manager-hub-payment-mean_label">
            <p class="m-0 text-truncate">
              {{ defaultPaymentMean?.label }}
            </p>
            <badge
              :level="statusCategory"
              class="manager-hub-payment-mean_status"
              :text-content="t(`hub_payment_mean_status_${paymentStatus}`)"
            ></badge>
          </div>
        </div>
        <span class="ml-auto oui-icon oui-icon-arrow-right" aria-hidden="true"> </span>
      </a>
    </div>
  </transition>
</template>

<script lang="ts">
import useLoadTranslations from '@/composables/useLoadTranslations';
import { defineAsyncComponent, defineComponent, Ref, ref } from 'vue';
import { buildURL } from '@ovh-ux/ufrontend/url-builder';
import { useI18n } from 'vue-i18n';
import { Payment, PaymentTypes } from '@/models/payment';
import getAvailablePaymentMeans from '@/utils/paymentMeans';
import axios from 'axios';

export default defineComponent({
  async setup() {
    const translationFolders = ['payment-mean'];
    useLoadTranslations(translationFolders);
    const { t } = useI18n();
    const defaultPaymentMean: Ref<Payment> = ref({} as Payment);
    const availablePaymentMeansPromise = await axios.get<PaymentTypes>(
      '/engine/apiv6/me/availableAutomaticPaymentMeans',
    );
    const availablePaymentMeans = getAvailablePaymentMeans(availablePaymentMeansPromise.data);
    const meansPromises = availablePaymentMeans.map((means) => {
      return axios.get(`/engine/apiv6/me/paymentMean/${means.id}`);
    });
    const meansResponses = await Promise.all(meansPromises);
    const meansDetailsUrls: string[] = [];
    meansResponses.forEach((responseMean) => {
      if (responseMean.data.length > 0) {
        responseMean.data.forEach((paymentMeanId: string) => {
          meansDetailsUrls.push(`${responseMean.config.url}/${paymentMeanId}`);
        });
      }
    });

    const meansDetailsPromises = meansDetailsUrls.map((url) => {
      return axios.get(url);
    });

    const meansDetails = await Promise.all(meansDetailsPromises);
    const paymentMeans = meansDetails.map((details) => details.data);

    defaultPaymentMean.value =
      paymentMeans?.find((paymentMean) => paymentMean?.defaultPaymentMean) || ({} as Payment);

    return { t, defaultPaymentMean };
  },
  components: {
    Badge: defineAsyncComponent(() => import('@/components/ui/Badge')),
  },
  methods: {
    buildURL,
  },
  computed: {
    paymentStatus(): string {
      return this.defaultPaymentMean?.state?.toUpperCase();
    },
    statusCategory() {
      switch (this.paymentStatus) {
        case 'CANCELED':
        case 'ERROR':
        case 'EXPIRED':
        case 'TOO_MANY_FAILURES':
          return 'error';
        case 'CANCELING':
        case 'CREATING':
        case 'MAINTENANCE':
        case 'PAUSED':
          return 'warning';
        case 'CREATED':
        case 'VALID':
          return 'success';
        default:
          return 'info';
      }
    },
  },
});
</script>

<style lang="scss" scoped>
@import '../styles/account-sidebar-payment.scss';

.slide-enter-active {
  -moz-transition-duration: 0.3s;
  -webkit-transition-duration: 0.3s;
  -o-transition-duration: 0.3s;
  transition-duration: 0.3s;
  -moz-transition-timing-function: ease-in;
  -webkit-transition-timing-function: ease-in;
  -o-transition-timing-function: ease-in;
  transition-timing-function: ease-in;
}

.slide-down-leave-active {
  -moz-transition-duration: 0.3s;
  -webkit-transition-duration: 0.3s;
  -o-transition-duration: 0.3s;
  transition-duration: 0.3s;
  -moz-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
  -webkit-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
  -o-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
  transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}

.slide-down-enter-to,
.slide-down-leave-from {
  max-height: 100px;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  overflow: hidden;
  max-height: 0;
}
</style>
