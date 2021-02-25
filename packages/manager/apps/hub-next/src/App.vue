<template>
  <div class="container-fluid hub-main-view_container">
    <div class="breadcrumbs">
      <!-- TODO: Convert this to breadcrumbs -->
      <div v-if="showNavigation">
        <router-link to="/"> {{ t('manager_hub_dashboard') }} </router-link> /
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
import { computed, defineComponent, nextTick, provide, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { detach } from '@ovh-ux/manager-preloader';
import useLoadTranslations from '@/composables/useLoadTranslations';

export default defineComponent({
  setup() {
    const productRangeName = ref('');
    provide('productRangeName', productRangeName);
    const route = useRoute();
    const showNavigation = computed(() => route.name !== 'Home');
    const { t, locale, fallbackLocale } = useI18n();
    const translationFolders = ['/'];

    useLoadTranslations(translationFolders);
    nextTick(() => {
      detach();
    });

    return {
      t,
      route,
      showNavigation,
      productRangeName,
      fallbackLocale,
      locale,
    };
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
