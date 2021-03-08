<template>
  <ovh-fragment fragment-id="navbar"></ovh-fragment>
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
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { listen } from '@ovh-ux/ufrontend/communication';
import { Environment } from '@ovh-ux/manager-config';

export default defineComponent({
  setup() {
    const route = useRoute();
    const showNavigation = computed(() => route.name !== 'Home');
    const i18n = useI18n();
    const { t, locale, fallbackLocale } = useI18n();
    const productRangeName = computed(() => t(`manager_hub_products_${route.query.productName}`));
    const dashboardTitle = computed(() => t('manager_hub_dashboard'));

    return {
      t,
      route,
      showNavigation,
      productRangeName,
      fallbackLocale,
      locale,
      dashboardTitle,
      i18n,
    };
  },
  mounted() {
    listen(async ({ id, locale }: any) => {
      if (id === 'locale.change') {
        Environment.setUserLocale(locale);
        window.location.reload();
      }
    });
  },
});
</script>

<style lang="scss">
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
</style>
