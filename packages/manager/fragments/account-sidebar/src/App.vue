<template>
  <account-sidebar />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AccountSidebar from './components/AccountSidebar';

export default defineComponent({
  name: 'App',
  components: {
    AccountSidebar,
  },
});
</script>
