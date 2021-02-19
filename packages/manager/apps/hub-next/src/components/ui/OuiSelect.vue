<template>
  <div class="v-oui-select" ref="select">
    <div @click="toggleList" class="fake-input-wrapper">
      <span type="text" class="v-oui-select-input fake-input"> {{ currentOption.value }} </span>
      <span class="oui-icon oui-icon-chevron-down"></span>
    </div>
    <div v-if="dropdownShown" class="v-oui-select-dropdown">
      <ul class="v-oui-select" role="listbox">
        <li
          v-for="option in options"
          :key="option.key"
          :value="option.value"
          @click="selectOption(option.key)"
          class="v-oui-option"
        >
          {{ option.value }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { onClickOutside } from '@vueuse/core';

export default defineComponent({
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    selectedOption: {
      type: Number,
      default: 1,
    },
  },
  emits: ['select-option'],
  setup(props) {
    const dropdownShown = ref(false);
    const select = ref(null);
    const currentOption = computed(() => props.options
      .filter((o) => o.key === props.selectedOption)[0]);

    onClickOutside(select, () => {
      dropdownShown.value = false;
    });

    return {
      select,
      dropdownShown,
      currentOption,
    };
  },
  methods: {
    toggleList() {
      this.dropdownShown = !this.dropdownShown;
    },
    selectOption(option) {
      this.$emit('select-option', option);
      this.toggleList();
    },
  },
});
</script>

<style lang="scss" scoped>
$select-background: #4bb2f6;
$select-hover-background: #0050d7;
$select-max-width: 15rem;
$select-left-right-padding: 1rem;
$select-icon-max-height: 2rem;
$select-icon-font-size: 1.5rem;
$select-border-radius: 0.25rem;
$select-border-width: 2px;
$option-vertical-padding: 0.3rem;
$fake-input-vertical-padding: 0.1rem;

.v-oui-select {
  text-align: left;
  position: relative;

  .fake-input-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: $select-border-width solid white;
    border-radius: $select-border-radius;
    max-width: $select-max-width;
    margin: auto;
    padding: $fake-input-vertical-padding $select-left-right-padding;

    &:hover {
      cursor: pointer;
    }

    .oui-icon {
      font-size: $select-icon-font-size;
      max-height: $select-icon-max-height;
    }
  }

  .v-oui-select-dropdown {
    border: $select-border-width solid white;
    max-width: $select-max-width;
    margin: auto;
    background: $select-background;
    position: absolute;
    transform-origin: center top 0px;
    left: 0;
    right: 0;

    .v-oui-select {
      margin: 0;
      padding: 0;

      .v-oui-option {
        list-style: none;
        margin: 0;
        padding: $option-vertical-padding $select-left-right-padding;

        &:hover {
          background: $select-hover-background;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
