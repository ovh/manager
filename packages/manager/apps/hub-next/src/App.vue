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
import {
  computed,
  defineComponent,
  provide,
  ref,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { loadLocaleMessages } from './i18n';

export default defineComponent({
  setup() {
    const route = useRoute();
    const showNavigation = computed(() => route.name !== 'Home');
    const { t, locale, fallbackLocale } = useI18n();
    const productRangeName = ref('');

    provide('productRangeName', productRangeName);

    return {
      t,
      route,
      showNavigation,
      productRangeName,
      fallbackLocale,
      locale,
    };
  },
  async mounted() {
    await this.$nextTick(async () => {
      await loadLocaleMessages(this.$i18n, this.locale);
      await loadLocaleMessages(this.$i18n, this.fallbackLocale);
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
