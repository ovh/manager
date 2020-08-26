<template>
  <nav role="navigation" class="oui-sidebar">
    <div class="oui-sidebar-menu">
      <Order></Order>
      <Items :items="config.items"></Items>
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue';
import Items from './components/items/Items.vue';
import Order from './components/order/Order.vue';
import { Sidebar } from './model/Sidebar';

export default Vue.extend({
  name: 'App',
  components: {
    Items,
    Order,
  },
  props: {
    items: Array,
    config: Sidebar,
  }
});
</script>

<style lang="scss">
.oui-sidebar {
  z-index: 1;
  box-shadow: 0 6px 6px rgba(0, 14, 156, 0.2);
  height: 100%;

  &-menu {
    padding: 0.625rem;
  }
}
</style>
