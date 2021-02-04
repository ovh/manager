<template>
  <suspense>
    <template #default>
      <keep-alive>
        <hub></hub>
      </keep-alive>
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </suspense>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Hub from '@/views/Hub.vue';

export default defineComponent({
  name: 'Home',
  components: {
    Hub,
  },
});
</script>
<style lang="scss">
.hub-main-view_container {
  max-width: 80rem;
  margin: auto;
}

.manager-preloader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 9999;
  display: flex !important;
}
</style>
