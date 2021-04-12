<template>
  <div>
    <h3>{{ t('hub_user_panel_shortcuts_title') }}</h3>
    <div class="d-flex flex-wrap justify-content-around">
      <div v-for="shortcut in shortcuts" :key="shortcut.id" class="account-sidebar-shortcuts_links">
        <div class="manager-hub-shortcut-tile">
          <a :href="shortcut.url" target="_blank"
            ><span :class="`manager-hub-shortcut-tile__icon oui-icon ${shortcut.icon}`"></span
          ></a>
        </div>
        <span class="manager-hub-shortcut-tile__description">{{
          t(`hub_user_panel_shortcuts_link_${shortcut.id}`)
        }}</span>
      </div>
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
    const translationFolders = ['shortcuts'];
    useLoadTranslations(translationFolders);
    return { t };
  },
  props: {
    shortcuts: [],
  },
});
</script>

<style lang="scss" scoped>
.manager-hub-shortcut-tile {
  @import '~@ovh-ux/ui-kit/dist/scss/_tokens';
  @import '~@ovh-ux/manager-hub/src/variables.scss';

  $notification-pill-font-color: $p-000-white;
  $notification-pill-bg-color: #b91a1a;
  $notification-pill-size: 1.2rem;

  text-align: center;

  > a {
    display: block;
    color: $p-800;
    font-weight: 600;

    &:hover {
      text-decoration: none;
    }
  }

  &__icon {
    display: flex;
    width: 4rem;
    height: 4rem;
    margin: auto;
    background-color: $p-000-white;
    border-radius: 0.4rem;
    justify-content: center;
    align-items: center;

    &:hover {
      background-color: $p-200;
    }
  }

  &__description {
    display: block;
    margin-top: 0.25rem;
    line-height: 1.25;
    font-size: 0.8rem;
    font-weight: 600;
    text-align: center;
    max-width: 4rem;
  }

  .oui-icon {
    font-size: 2rem;
    margin-top: 1rem;
    color: $p-800;
  }
}
</style>
