<template>
  <div class="dropdown-wrapper" ref="dropdownWrapper">
    <div class="dropdown-clickable" @click="toggleDropdown">
      <slot></slot>
    </div>
    <div v-if="dropdownShown" class="dropdown">
      <ul class="entries">
        <li class="entry" v-for="entry in entries" :key="entry">{{ entry }}</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { onClickOutside } from '@vueuse/core';

export default defineComponent({
  setup() {
    const dropdownShown = ref(false);
    const dropdownWrapper = ref(null);

    onClickOutside(dropdownWrapper, () => {
      dropdownShown.value = false;
    });

    return {
      dropdownShown,
      dropdownWrapper,
    };
  },
  props: {
    entries: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    toggleDropdown() {
      this.dropdownShown = !this.dropdownShown;
    },
  },
});
</script>

<style lang="scss" scoped>
$radius: 0.8em;
$background: white;
$transition-duration: 0.4s;
$vertical-padding: 0.3rem;
$horizontal-padding: 0.8rem;
$box-shadow: 0 3px 6px 0 rgba(0, 14, 156, 0.2);

.dropdown-wrapper {
  .dropdown {
    position: absolute;

    .entries {
      position: relative;
      z-index: 1;
      margin: 0;
      padding: 0;
      background: $background;
      border-radius: $radius;
      box-shadow: $box-shadow;
      width: fit-content;

      .entry {
        transition: all $transition-duration ease;
        margin: 0;
        padding: $vertical-padding $horizontal-padding;
        list-style: none;
        width: 100%;

        &:hover {
          background-color: #bef1ff;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
