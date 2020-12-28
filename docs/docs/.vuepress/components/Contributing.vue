<template>
  <div>
    <div v-if="loading">
      <p>Loading…</p>
    </div>

    <p v-if="rejected">
      Unable to get the CONTRIBUTING.md file.
    </p>

    <div
      v-if="success"
      v-html="content">
    </div>
  </div>
</template>

<script>
import md from 'markdown-it';

export default {
  data() {
    return {
      loading: false,
      success: false,
      rejected: false,
      content: null
    };
  },
  async mounted () {
    this.loading = true;
    try {
      const contributing = await fetch('https://raw.githubusercontent.com/ovh/manager/master/CONTRIBUTING.md');
      const response = await contributing;

      if (response.status !== 200) {
        this.rejected = true;
        return;
      }

      const text = await response.text();
      this.content = md().render(text);
      this.success = true;
    } catch (error) {
      this.rejected = true;
    } finally {
      this.loading = false;
    }
  }
}
</script>
