import React, { Suspense } from 'react';

import { Navigate, Outlet } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BaseLayout, ChangelogMenu, GuideMenu } from '@ovh-ux/muk';

import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb.component';
import { CHANGELOG_LINKS } from '@/constants/Changelog.constants';
import { useShares } from '@/data/hooks/shares/useShares';
import { ShareDatagrid } from '@/pages/list/components/ShareDatagrid.component';
import { selectSharesForList } from '@/pages/list/view-model/shareList.view-model';
import { useFileStorageGuideItems } from '@/pages/view-model/guides.view-model';
import { subRoutes } from '@/routes/Routes.constants';

const ShareListPage: React.FC = () => {
  const { t } = useTranslation(['list', 'guides']);
  const { data: shares = [], isLoading } = useShares({
    select: selectSharesForList,
  });

  const guideItems = useFileStorageGuideItems();

  if (!isLoading && (shares?.length ?? 0) === 0) {
    return <Navigate to={`${subRoutes.onboarding}`} replace />;
  }

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb />}
      header={{
        title: t('list:title'),
        guideMenu: <GuideMenu items={guideItems} />,
        changelogButton: <ChangelogMenu links={CHANGELOG_LINKS} />,
      }}
    >
      <ShareDatagrid />
      <Suspense>
        <Outlet />
      </Suspense>
    </BaseLayout>
  );
};

export default ShareListPage;
