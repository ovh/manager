<template>
  <hub v-if="status"></hub>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Hub from '@/views/Hub.vue';
import { mapGetters, useStore } from 'vuex';

export default defineComponent({
  name: 'Home',
  setup() {
    const store = useStore();

    store.dispatch('fetchHubData');
    return {
      store,
    };
  },
  components: {
    Hub,
  },
  computed: {
    ...mapGetters({
      status: 'getHubStatus',
    }),
  },
});
</script>
<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

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
