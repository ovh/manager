<template>
  <div class="hub-dashboard-content">
    <hub-section :title="welcomeMessage">
      <template #content>
        <div
          v-if="warningNotifications.length"
          class="d-flex flex-wrap w-100 minw-0 align-items-center justify-content-between"
        >
          <carousel level="warning" :messages="warningNotifications"></carousel>
        </div>
      </template>
    </hub-section>
    <hub-section :title="t('manager_hub_dashboard_overview')">
      <template #content>
        <activity></activity>
      </template>
    </hub-section>
    <hub-section :title="t('manager_hub_dashboard_services')">
      <template #content>
        <Suspense>
          <template #default>
            <products-list :max-items-per-product="4"></products-list>
          </template>
          <template #fallback>
            <products-list-skeleton></products-list-skeleton>
          </template>
        </Suspense>
      </template>
    </hub-section>
  </div>
</template>

<script lang="ts">
import {
  defineAsyncComponent, defineComponent, nextTick, Ref, ref,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { OvhNotification, User } from '@/models/hub.d';
import { PRODUCTS_TO_SHOW_DEFAULT } from '@/constants/products_consts';
import { loadLocaleMessages } from '@/i18n';
import { detach } from '@ovh-ux/manager-preloader';
import ProductsListSkeleton from '@/views/products-list/ProductsListSkeleton.vue';
import axios from 'axios';

export default defineComponent({
  async setup() {
    const { locale, t, fallbackLocale } = useI18n();
    const i18n = useI18n();
    const notifications = ref();
    const user: Ref<User> = ref({} as User);

    const translationFolders = [
      'preload-welcome',
      'products',
      'payment-status-tile',
      'order-tracking',
      'enterprise-billing-summary',
      'catalog-items',
      'carousel',
      'billing',
      'billing-summary',
      'support',
      'welcome',
      'ovh-order-tracking',
    ];
    axios.get('/engine/2api/hub/notifications').then((response) => {
      notifications.value = response.data.data.notifications.data;
    });

    await loadLocaleMessages(i18n, locale.value, translationFolders);
    await loadLocaleMessages(i18n, fallbackLocale.value, translationFolders);
    await nextTick();
    const userReponse = await axios.get('/engine/2api/hub/me');
    user.value = userReponse.data.data.me.data;
    await nextTick(() => {
      detach();
    });

    return {
      t,
      locale,
      fallbackLocale,
      notifications,
      user,
    };
  },
  data() {
    return {
      PRODUCTS_TO_SHOW_DEFAULT,
      maxProductsToShow: PRODUCTS_TO_SHOW_DEFAULT,
    };
  },
  components: {
    HubSection: defineAsyncComponent(() => import('@/components/HubSection.vue')),
    Activity: defineAsyncComponent(() => import('@/views/Activity.vue')),
    ProductsList: defineAsyncComponent(() => import('@/views/products-list/ProductsList.vue')),
    Carousel: defineAsyncComponent(() => import('@/components/ui/Carousel.vue')),
    ProductsListSkeleton,
  },
  computed: {
    welcomeMessage(): string {
      return this.t('manager_hub_dashboard_welcome', { name: this.user?.firstname });
    },
    warningNotifications(): OvhNotification[] {
      return Array.isArray(this.notifications)
        ? this.notifications
          .filter((notification: OvhNotification) => notification.level === 'warning')
          .map((notification) => notification.description)
        : [];
    },
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
