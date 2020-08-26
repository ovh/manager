<template>
  <ul class="oui-sidebar-list">
    <li v-for="item in items" :key="item.label" class="oui-sidebar-list__item">
      <a v-if="item.href" :href="item.href" class="oui-sidebar-link">
        <span>{{ item.label }}</span>
      </a>
      <span class="oui-sidebar-link" v-if="!item.href">{{ item.label }}</span>
      <Sidebar :items="item.subitems"></Sidebar>
    </li>
  </ul>
</template>

<script lang="ts">
import Vue from 'vue';
import SidebarElement from '../../model/SidebarElement';

export default Vue.extend({
  name: 'Sidebar',
  props: {
    items: [SidebarElement],
  },
});
</script>
