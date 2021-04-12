<template>
  <div class="manager-hub-user-panel_links">
    <h3>{{ t('hub_links_title') }}</h3>
    <div v-for="link in links" :key="link.href">
      <span class="manager-hub-user-panel_divider"></span>
      <a :href="link.href" class="d-flex">
        <span :class="link.icon"></span>
        <span> {{ t(link.label) }} </span>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import useLoadTranslations from '@/composables/useLoadTranslations';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  setup() {
    const { t } = useI18n();
    const translationFolders = ['useful-links'];
    useLoadTranslations(translationFolders);
    return { t };
  },
  props: {
    links: [],
  },
});
</script>
<style lang="scss" scoped>
@import '~@ovh-ux/manager-hub/src/variables.scss';
.manager-hub-user-panel_links {
  padding-bottom: 3rem !important;
  a,
  .btn-link {
    font-weight: bold;
    color: $p-500;
    padding: 0;
    text-decoration: none;
    white-space: initial;
    text-align: left;
    letter-spacing: normal;

    .oui-icon {
      line-height: 1;
      color: $p-500;
      font-size: 1.5rem;
      vertical-align: middle;
      margin-right: 1rem;
    }

    &:hover {
      text-decoration: none;
    }
  }
}

.manager-hub-user-panel_divider {
  display: block;
  border-top: 1px solid darken($p-075, 10%);
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}
</style>
