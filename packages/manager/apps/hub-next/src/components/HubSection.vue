<template>
  <h2 class="section-title">
    {{ title }}
  </h2>
  <div class="row">
    <slot name="content"></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    title: String,
  },
});
</script>
<style lang="scss" scoped>
.section-title {
  text-align: left;
}
</style>
