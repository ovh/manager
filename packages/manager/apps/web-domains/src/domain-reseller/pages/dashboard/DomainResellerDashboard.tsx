import { BaseLayout, Notifications, useNotifications } from '@ovh-ux/muk';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import DomainResellerTabs from '@/domain-reseller/components/Tabs/DomainResellerTabs';

export default function DomainResellerDashboard() {
  const { t } = useTranslation('domain-reseller');
  const { notifications } = useNotifications();
  const header = {
    title: t('domain_reseller_title'),
  };

  return (
    <BaseLayout
      header={header}
      tabs={<DomainResellerTabs />}
      message={notifications.length ? <Notifications /> : null}
    >
      <Outlet />
    </BaseLayout>
  );
}
