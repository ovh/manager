<template>
  <sidebar :closed="closed" class="manager-hub-user-panel">
    <account-sidebar-user-infos class="mb-3" :user="user"></account-sidebar-user-infos>
    <account-sidebar-payment class="mb-4"></account-sidebar-payment>
    <account-sidebar-shortcuts class="mb-4" :shortcuts="shortcutList"></account-sidebar-shortcuts>
    <account-sidebar-links class="mb-5" :links="usefulLinks"></account-sidebar-links>
  </sidebar>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent, PropType } from 'vue';
import { Environment } from '@ovh-ux/manager-config';
import { emit } from '@ovh-ux/ufrontend/communication';
import shortcuts from '@/views/account-sidebar/shortcuts';
import links from '@/views/account-sidebar/panelLinks';
import { User } from '@/models/hub';

export default defineComponent({
  props: {
    closed: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Object as PropType<User>,
      default: {},
    },
  },
  mounted() {
    emit({ id: 'ovh.account-sidebar.ready' });
  },
  components: {
    Sidebar: defineAsyncComponent(() => import('@/components/ui/Sidebar')),
    AccountSidebarUserInfos: defineAsyncComponent(() =>
      import('@/views/account-sidebar/AccountSidebarUserInfos'),
    ),
    AccountSidebarPayment: defineAsyncComponent(() =>
      import('@/views/account-sidebar/AccountSidebarPayment'),
    ),
    AccountSidebarShortcuts: defineAsyncComponent(() =>
      import('@/views/account-sidebar/AccountSidebarShortcuts'),
    ),
    AccountSidebarLinks: defineAsyncComponent(() =>
      import('@/views/account-sidebar/AccountSidebarLinks'),
    ),
  },
  computed: {
    shortcutList() {
      return shortcuts({}, Environment.getRegion());
    },
    usefulLinks() {
      return links({});
    },
  },
});
</script>

<style lang="scss">
.manager-hub-user-panel {
  @import '~@ovh-ux/ui-kit/dist/scss/_tokens.scss';
  @import '~bootstrap4/scss/_functions.scss';
  @import '~bootstrap4/scss/_variables.scss';
  @import '~bootstrap4/scss/_mixins.scss';
  @import '~bootstrap4/scss/_utilities.scss';
  @import '~bootstrap4/scss/_grid.scss';
  @import '~bootstrap4/scss/_buttons.scss';
  @import '~bootstrap4/scss/_button-group.scss';
  @import '~@ovh-ux/manager-hub/src/variables.scss';

  width: 18.75rem;
  padding-left: 2.75rem;
  background-color: $p-075;
  height: 100%;
  padding: 2rem;
  padding-top: 3rem;
  overflow: auto;
  margin-bottom: 3rem !important;

  .minw-0 {
    min-width: 0;
  }

  h3 {
    font-size: 1rem;
    font-weight: $jupiter-font-weight;
    color: $p-800;

    * {
      color: inherit;
    }
  }

  p {
    line-height: inherit;
  }
}
</style>
