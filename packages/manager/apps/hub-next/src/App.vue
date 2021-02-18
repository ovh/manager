<template>
  <div class="container-fluid hub-main-view_container">
    <div id="nav">
      <!-- TODO: Convert this to breadcrumbs -->
      <div v-if="showNavigation">
        <router-link to="/"> {{ t('manager_hub_dashboard') }} </router-link> |
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

export default defineComponent({
  setup() {
    const route = useRoute();
    const showNavigation = computed(() => route.name !== 'Home');
    const { t } = useI18n();
    const productRangeName = ref('');

    provide('productRangeName', productRangeName);

    return {
      t,
      route,
      showNavigation,
      productRangeName,
    };
  },
});
</script>

<style lang="scss">
#nav {
  padding: 30px;
  text-align: left;
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
