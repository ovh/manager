<template>
  <div class="container">
    <suspense>
      <template #default>
        <hub></hub>
      </template>
      <template #fallback>
        <div>Loading...</div>
      </template>
    </suspense>
  </div>
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
