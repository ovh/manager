<template>
  <div class="hub-dashboard-content">
    <hub-section :title="t('manager_hub_dashboard_welcome', { name: user.firstname })">
      <template #content>
        <div class="d-flex flex-wrap w-100 minw-0 align-items-center justify-content-between">
          <div class="ovh-manager-hub-carousel w-100">
            <!-- TODO : Create carousel component -->
            <div class="oui-message oui-message_error">
              <span class="oui-message__icon oui-icon oui-icon-warning"></span>
              <span
                v-for="notification in warningNotifications.splice(0, 1)"
                :key="notification.id"
                v-html="notification.description"
                class="oui-message__body"
              >
              </span>
            </div>
          </div>
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
        <products-list :max-items-per-product="4"></products-list>
      </template>
    </hub-section>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue';
import { mapGetters, useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { OvhNotification } from '@/models/hub.d';

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
    Activity: defineAsyncComponent(() => import('@/views/Activity.vue')),
    ProductsList: defineAsyncComponent(() => import('@/views/ProductsList.vue')),
  },
  computed: {
    ...mapGetters({
      user: 'getUser',
      notifications: 'getNotifications',
    }),
    warningNotifications(): OvhNotification[] {
      return this.notifications.filter(
        (notification: OvhNotification) => notification.level === 'warning',
      );
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

.ovh-manager-hub-carousel {
  @import '@ovh-ux/ui-kit/dist/scss/_tokens';

  .oui-message {
    padding: 1rem 3rem;

    &__next {
      position: absolute;
      top: 50%;
      right: 0.5rem;
      margin-top: -1rem;

      .oui-icon {
        font-size: 1.5rem;
      }
    }

    &__bullets {
      text-align: center;
    }

    &__body {
      font-weight: 600;
    }
  }

  a.oui-message__body {
    &:hover,
    &:focus,
    &:active {
      text-decoration-color: $ae-500;
      color: $ae-500;
    }
  }

  .circular-tile {
    display: inline-block;
    margin: 0.25rem;
    border-radius: 0.625rem;
    background-color: $p-000-white;
    padding: 0.1875rem;
    border: $ae-500;
    cursor: pointer;

    &_active {
      background-color: $ae-500;
    }
  }
}
</style>
