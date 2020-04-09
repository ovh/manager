<template>
  <div>
    <div v-if="loading">
      <p>Loading…</p>
    </div>

    <p v-if="rejected">
      Unable to get the packages list.
    </p>

    <ul v-if="success">
      <li
        v-for="{ package: { name, description, repository, version } } in packages"
        v-bind:key="name">
        <a
          v-bind:href="'https://github.com/ovh/manager/tree/master/' + repository.directory"
          rel="noopener noreferrer"
          target="_blank">
          {{ name }}@{{ version }}
        </a>
        <br>
        <span>
          <strong>Description</strong>: {{ description || 'n/a' }}
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

<style lang="stylus" scoped>
  ul
    padding-left inherit

    > li
      list-style-type none

      > span
        font-size smaller
</style>
