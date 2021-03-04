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
        <component :key="renderKey" :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, provide, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { listen } from '@ovh-ux/ufrontend/communication';
import { setI18nLanguage } from './i18n';

export default defineComponent({
  setup() {
    const renderKey = ref(0);
    const route = useRoute();
    const showNavigation = computed(() => route.name !== 'Home');
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
      renderKey,
      dashboardTitle,
    };
  },
  mounted() {
    listen(({ id, locale }: any) => {
      if (id === 'locale.change') {
        setI18nLanguage(this.$i18n, locale);
        this.rerender();
      }
    });
  },
  methods: {
    rerender() {
      this.renderKey += 1;
    },
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
