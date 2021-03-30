<template>
  <transition :name="`slide-${sidebarOrientationClass}`">
    <div v-if="!closed" class="sidebar" :class="sidebarOrientationClass">
      <slot></slot>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    left: {
      type: Boolean,
      default: false,
    },
    closed: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    sidebarOrientationClass(): string {
      return this.left ? 'left' : 'right';
    },
  },
});
</script>

<style lang="scss" scoped>
.sidebar {
  height: 100%;
  position: fixed;
  z-index: 1;
}

.slide-right-leave-active,
.slide-right-enter-active {
  transition: 0.3s;
}
.slide-right-enter-from {
  transform: translate(100%, 0);
}
.slide-right-leave-to {
  transform: translate(100%, 0);
}

.slide-left-leave-active,
.slide-left-enter-active {
  transition: 0.3s;
}
.slide-left-enter-from {
  transform: translate(-100%, 0);
}
.slide-left-leave-to {
  transform: translate(-100%, 0);
}

.right {
  right: 0;
}

.left {
  left: 0;
}
</style>
