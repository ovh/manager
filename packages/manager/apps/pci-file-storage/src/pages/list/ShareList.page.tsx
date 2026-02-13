import React, { Suspense } from 'react';

import { Navigate, Outlet } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { Notifications } from '@ovh-ux/muk';

import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb.component';
import { useShares } from '@/data/hooks/shares/useShares';
import { ShareDatagrid } from '@/pages/list/components/ShareDatagrid.component';
import { selectSharesForList } from '@/pages/list/view-model/shareList.view-model';
import { subRoutes } from '@/routes/Routes.constants';

const ShareListPage: React.FC = () => {
  const { t } = useTranslation(['list']);
  const { data: shares = [], isLoading } = useShares({
    select: selectSharesForList,
  });

  if (!isLoading && (shares?.length ?? 0) === 0) {
    return <Navigate to={`${subRoutes.onboarding}`} replace />;
  }

  return (
    <main className="px-4 py-8 md:mt-2 md:px-10 md:py-9">
      <Breadcrumb />
      <section className="mt-8">
        <Text preset="heading-2" className="mb-6">
          {t('list:title')}
        </Text>
        <div>
          <Notifications />
        </div>
        <ShareDatagrid />
      </section>
      <Suspense>
        <Outlet />
      </Suspense>
    </main>
  );
};

export default ShareListPage;
