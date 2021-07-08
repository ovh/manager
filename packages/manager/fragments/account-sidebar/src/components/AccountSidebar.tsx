import { defineComponent, inject, onMounted, ref, computed, Suspense, Ref } from 'vue';
import { emit, listen } from '@ovh-ux/ufrontend/communication';
import shortcuts from '@/utils/shortcuts';
import links from '@/utils/panelLinks';
import AccountSidebarPaymentSkeleton from '@/components/AccountSidebarPaymentSkeleton.vue';
import Sidebar from '@/components/ui/Sidebar';
import AccountSidebarUserInfos from '@/components/AccountSidebarUserInfos';
import AccountSidebarPayment from '@/components/AccountSidebarPayment';
import AccountSidebarShortcuts from '@/components/AccountSidebarShortcuts';
import AccountSidebarLinks from '@/components/AccountSidebarLinks';
import { User } from '@/models/user';

import '../styles/account-sidebar-panel.scss';

const AccountSidebar = defineComponent(() => {
  const environment = inject('environment') as any;
  const user = inject('user') as Ref<User>;
  const hasChatbot = ref(false);
  const sidebarOpen = ref(true);
  const shortcutList = computed(() => shortcuts(user.value, environment?.getRegion()));
  const usefullLinks = computed(() =>
    links(user.value, hasChatbot.value, environment?.getRegion()),
  );

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

  return () => (
    <Sidebar closed={!sidebarOpen.value} class="manager-hub-user-panel">
      <AccountSidebarUserInfos user={user.value} class="mb-3">
        <Suspense>
          {{
            default: () => <AccountSidebarPayment class="mb-4"></AccountSidebarPayment>,
            fallback: () => (
              <AccountSidebarPaymentSkeleton class="mb-4"></AccountSidebarPaymentSkeleton>
            ),
          }}
        </Suspense>
      </AccountSidebarUserInfos>
      <AccountSidebarShortcuts
        className="mb-4"
        shortcuts={shortcutList.value}
      ></AccountSidebarShortcuts>
      <AccountSidebarLinks class="mb-5" links={usefullLinks.value}></AccountSidebarLinks>
    </Sidebar>
  );
});

export default AccountSidebar;
