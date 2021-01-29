<template>
<div class="tile">
  <div class="oui-tile">
    <div class="ovh-manager-hub-tile__header" v-if="title">
      <h3 class="oui-tile__title">
        <span>{{ title }}</span>
        <span v-if="count" class="oui-badge oui-badge_info">
          {{ count }}
        </span>
      </h3>
    </div>
    <div class="oui-tile__body">
      <slot name="body"></slot>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    title: String,
    count: Number,
  },
});
</script>

<style lang="scss" scoped>

</style>
