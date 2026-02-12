import { Suspense } from 'react';

import { Outlet } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Headers } from '@ovh-ux/manager-react-components';

export default function MemberPage() {
  const { t } = useTranslation('pools/members');
  return (
    <>
      <div className="header mt-8">
        <Headers
          description={t('octavia_load_balancer_pools_detail_members_description_part_1')}
          title={t('octavia_load_balancer_pools_detail_members_info_title')}
        />
      </div>
      <Suspense>
        <Outlet />
      </Suspense>
    </>
  );
}
