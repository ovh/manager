<template>
  <sidebar :closed="closed" class="manager-hub-user-panel">
    <div class="mb-3">
      <account-sidebar-user-infos :user="user"></account-sidebar-user-infos>
    </div>
    <div class="mb-4">
      <account-sidebar-payment></account-sidebar-payment>
    </div>
    <div class="mb-4">
      <account-sidebar-shortcuts :shortcuts="shortcutList"></account-sidebar-shortcuts>
    </div>
    <div class="mb-5">
      <account-sidebar-links :links="usefulLinks"></account-sidebar-links>
    </div>
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

<style lang="scss" scoped>
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

  &_divider {
    display: block;
    border-top: 1px solid darken($p-075, 10%);
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }

  &_links {
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
}
</style>
