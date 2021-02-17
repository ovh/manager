<template>
  <div class="v-oui-select">
    <div @click="toggleList" class="fake-input-wrapper">
      <span type="text" class="v-oui-select-input fake-input"> {{ selectedOption.value }} </span>
      <span class="oui-icon oui-icon-chevron-down"></span>
    </div>
    <div v-if="dropdownShown" class="v-oui-select-dropdown">
      <ul class="v-oui-select" role="listbox">
        <li
          class="v-oui-option"
          :value="option.value"
          v-for="option in options"
          :key="option.key"
          @click="selectOption(option)"
        >
          {{ option.value }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    options: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['select-option'],
  data() {
    return {
      dropdownShown: false,
      selectedOption: this.options.find((o) => o.selected) ?? this.options[0],
    };
  },
  methods: {
    toggleList() {
      this.dropdownShown = !this.dropdownShown;
    },
    selectOption(option) {
      this.selectedOption = option;
      this.$emit('select-option', option);
      this.toggleList();
    },
  },
});
</script>

<style lang="scss" scoped>
.v-oui-select {
  text-align: left;
  position: relative;

  .fake-input-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 2px solid white;
    border-radius: 0.25rem;
    max-width: 15rem;
    margin: auto;
    padding: 0.1rem 1rem;

    &:hover {
      cursor: pointer;
    }

    .oui-icon {
      font-size: 1.5rem;
      max-height: 2rem;
    }
  }

  .v-oui-select-dropdown {
    border: 2px solid white;
    max-width: 15rem;
    margin: auto;
    background: #4bb2f6;
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
        padding: 0.3rem 1rem;

        &:hover {
          background: #0050d7;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
