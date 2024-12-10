<template>
  <div>
    <div v-if="loading">
      <p>Loading…</p>
    </div>

    <p v-if="rejected">
      Unable to get the packages list.
    </p>

    <ul v-if="success">
      <li v-if="packages.length === 0">
        No packages found.
      </li>
      <li v-for="pkg in packages" :key="pkg?.package?.name">
        <a
          v-if="pkg?.package?.repository"
          :href="'https://github.com/ovh/manager/tree/master/' + pkg?.package?.repository?.directory"
          rel="noopener noreferrer"
          target="_blank">
          {{ pkg?.package?.name || 'n/a' }}@{{ pkg?.package?.version || 'n/a' }}
        </a>
        <span v-else>
          {{ pkg?.package?.name || 'n/a' }}@{{ pkg?.package?.version || 'n/a' }}
        </span>
        <br>
        <span>
          <strong>Description</strong>: {{ pkg?.package?.description || 'n/a' }}
        </span>
        <hr>
      </li>
    </ul>
  </div>
</template>

<script>
const getWorkspace = (type) => {
  switch (type) {
    case 'apps':
    case 'modules':
    case 'tools':
      return `packages/manager/${type}/*`
    default:
      return `packages/components/*`;
  }
};

export default {
  props: {
    type: String,
  },
  data() {
    return {
      loading: false,
      success: false,
      rejected: false,
      packages: [],
    };
  },
  async mounted () {
    this.loading = true;

    try {
      const packages = await fetch('/manager/assets/json/packages.json');
      const packagesAsJson = await packages.json();
      const { packagesList } = packagesAsJson.find((pkg) => pkg.workspace === getWorkspace(this.type));

      this.packages = packagesList;
      this.success = true;
    } catch (error) {
      this.rejected = true;
    } finally {
      this.loading = false;
    }
  }
}
</script>

<style scoped>
  ul {
    padding-left: inherit
  }
  ul > li {
    list-style-type: none
  }
  ul > li > span {
    font-size: smaller
  }
</style>
