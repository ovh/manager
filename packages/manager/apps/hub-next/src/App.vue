<template>
  <ovh-fragment fragment-id="navbar"></ovh-fragment>
  <div class="hub-wrapper">
    <account-sidebar :closed="!sidebarOpen"></account-sidebar>
    <div class="hub-main-view" :class="isLargeScreen ? 'hub-main-view_sidebar_expanded' : ''">
      <div class="container-fluid hub-main-view_container">
        <div class="breadcrumbs">
          <div v-if="showNavigation">
            <router-link to="/"> {{ dashboardTitle }} </router-link> /
            <router-link to="/product-details"> {{ productRangeName }} </router-link>
          </div>
        </div>
        <router-view v-slot="{ Component }">
          <keep-alive include="Home">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineAsyncComponent, defineComponent, onMounted, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { listen } from '@ovh-ux/ufrontend/communication';
import { Environment } from '@ovh-ux/manager-config';
import useWindowResize from '@/composables/useWindowResize';

export default defineComponent({
  setup() {
    const route = useRoute();
    const sidebarOpen = ref(true);
    const sidebarToggledManually = ref(false);
    const width = useWindowResize();
    const isLargeScreen = computed(() => width.value > 1024);
    const showNavigation = computed(() => route.name !== 'Home');
    const i18n = useI18n();
    const { t, locale, fallbackLocale } = useI18n();
    const productRangeName = computed(() => t(`manager_hub_products_${route.query.productName}`));
    const dashboardTitle = computed(() => t('manager_hub_dashboard'));

    onMounted(() => {
      listen((listener: { id: string; locale: string }) => {
        if (listener.id === 'locale.change') {
          Environment.setUserLocale(listener.locale);
          window.location.reload();
        }

        if (listener.id === 'ovh.account-sidebar.toggle') {
          if (!isLargeScreen.value) sidebarOpen.value = !sidebarOpen.value;
          if (!sidebarToggledManually.value) sidebarToggledManually.value = true;
        }
      });
    });

    watchEffect(() => {
      if (isLargeScreen.value) {
        sidebarOpen.value = true;
        sidebarToggledManually.value = false;
      }
      if (!isLargeScreen.value && !sidebarToggledManually.value) sidebarOpen.value = false;
    });

    return {
      t,
      route,
      showNavigation,
      productRangeName,
      fallbackLocale,
      locale,
      dashboardTitle,
      i18n,
      sidebarOpen,
      width,
      isLargeScreen,
    };
  },
  components: {
    AccountSidebar: defineAsyncComponent(() => import('@/views/account-sidebar/AccountSidebar')),
  },
});
</script>

<style lang="scss">
body {
  overflow: hidden;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.breadcrumbs {
  padding: 30px 0;
  text-align: left;
  a {
    &.router-link-exact-active {
      color: #4d5592;
      font-weight: normal;
    }
  }
}

.hub-wrapper {
  height: 100%;
  width: 100%;
  position: absolute;
  overflow-y: auto;
  padding-bottom: 3rem;

  .hub-main-view {
    height: 100%;
  }

  .hub-main-view_container {
    height: 100%;
    ::-webkit-scrollbar {
      width: 0 !important; /* Remove scrollbar space */
      background: transparent; /* Optional: just make scrollbar invisible */
    }
  }

  .hub-main-view_sidebar_expanded {
    margin-right: 18.75rem;
  }
}
</style>
