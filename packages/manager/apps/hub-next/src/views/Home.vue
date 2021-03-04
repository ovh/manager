<template>
  <Suspense>
    <template #default>
      <hub></hub>
    </template>
    <template #fallback>
      <div class="loader">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </template>
  </Suspense>
</template>

<script lang="ts">
import { defineComponent, nextTick } from 'vue';
import { detach } from '@ovh-ux/manager-preloader';
import Hub from '@/views/Hub.vue';
import useLoadTranslations from '@/composables/useLoadTranslations';

export default defineComponent({
  name: 'Home',
  setup() {
    const translationFolders = ['/'];
    useLoadTranslations(translationFolders);

    nextTick(() => {
      detach();
    });
  },
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

.loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex !important;
  align-items: center;
  justify-content: center;
}
</style>
