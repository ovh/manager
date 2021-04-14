<template>
  <sidebar :closed="!sidebarOpen" class="manager-hub-user-panel">
    <account-sidebar-user-infos class="mb-3" :user="user"></account-sidebar-user-infos>
    <Suspense>
      <template #default>
        <account-sidebar-payment class="mb-4"></account-sidebar-payment>
      </template>
      <template #fallback>
        <account-sidebar-payment-skeleton class="mb-4"></account-sidebar-payment-skeleton>
      </template>
    </Suspense>
    <account-sidebar-shortcuts class="mb-4" :shortcuts="shortcutList"></account-sidebar-shortcuts>
    <account-sidebar-links class="mb-5" :links="usefulLinks"></account-sidebar-links>
  </sidebar>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent, inject, onMounted, ref, Ref } from 'vue';
import { Environment } from '@ovh-ux/manager-config';
import { emit, listen } from '@ovh-ux/ufrontend/communication';
import shortcuts from '@/utils/shortcuts';
import links from '@/utils/panelLinks';
import AccountSidebarPaymentSkeleton from '@/components/AccountSidebarPaymentSkeleton.vue';
import { User } from '@/models/user';

export default defineComponent({
  setup() {
    const user = inject('user') as Ref<User>;
    const hasChatbot = ref(false);
    const sidebarOpen = ref(true);

    onMounted(() => {
      emit({ id: 'ovh.account-sidebar.ready' });

      listen(({ id }: { id: string }) => {
        if (id === 'ovh.chatbot.enable') {
          hasChatbot.value = true;
        }

        if (id === 'ovh.account-sidebar.toggle') {
          sidebarOpen.value = !sidebarOpen.value;
        }

        if (id === 'ovh.account-sidebar.open') {
          sidebarOpen.value = true;
        }

        if (id === 'ovh.account-sidebar.close') {
          sidebarOpen.value = false;
        }
      });
    });

    return {
      user,
      hasChatbot,
      sidebarOpen,
    };
  },
  components: {
    Sidebar: defineAsyncComponent(() => import('@/components/ui/Sidebar')),
    AccountSidebarUserInfos: defineAsyncComponent(() =>
      import('@/components/AccountSidebarUserInfos'),
    ),
    AccountSidebarPayment: defineAsyncComponent(() => import('@/components/AccountSidebarPayment')),
    AccountSidebarShortcuts: defineAsyncComponent(() =>
      import('@/components/AccountSidebarShortcuts'),
    ),
    AccountSidebarLinks: defineAsyncComponent(() => import('@/components/AccountSidebarLinks')),
    AccountSidebarPaymentSkeleton,
  },
  computed: {
    shortcutList(): any {
      return shortcuts(this.user, Environment.getRegion());
    },
    usefulLinks(): any {
      return links(this.user, this.hasChatbot);
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
