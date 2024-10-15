import { Headers, Notifications } from '@ovh-ux/manager-react-components';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';

export default function MemberPage() {
  const { t } = useTranslation('pools/members');
  return (
    <>
      <div className="header mt-8">
        <Headers
          description={t(
            'octavia_load_balancer_pools_detail_members_description_part_1',
          )}
          title={t('octavia_load_balancer_pools_detail_members_info_title')}
        />
      </div>
      <Notifications />
      <Suspense>
        <Outlet />
      </Suspense>
    </>
  );
}
