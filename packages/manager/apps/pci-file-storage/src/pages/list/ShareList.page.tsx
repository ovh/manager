import React, { Suspense } from 'react';

import { Navigate, Outlet } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BaseLayout, ChangelogMenu, GuideMenu } from '@ovh-ux/muk';

import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb.component';
import { CHANGELOG_LINKS } from '@/constants/Changelog.constants';
import { useShareCreationPolling } from '@/data/hooks/operation/useShareCreationPolling';
import { useShares } from '@/data/hooks/shares/useShares';
import { ShareCreationBanner } from '@/pages/list/components/ShareCreationBanner.component';
import { ShareDatagrid } from '@/pages/list/components/ShareDatagrid.component';
import { selectHasShares } from '@/pages/list/view-model/shareList.view-model';
import { useFileStorageGuideItems } from '@/pages/view-model/guides.view-model';
import { subRoutes } from '@/routes/Routes.constants';

const ShareListPage: React.FC = () => {
  const { t } = useTranslation(['list', 'guides']);
  const { shareCreationsCount, hasError } = useShareCreationPolling();
  const { data: hasShare = false, isLoading } = useShares({
    select: selectHasShares,
  });

  const guideItems = useFileStorageGuideItems();

  if (!isLoading && !hasShare) {
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
      <ShareCreationBanner shareCreationsCount={shareCreationsCount} hasError={hasError} />
      <ShareDatagrid />
      <Suspense>
        <Outlet />
      </Suspense>
    </BaseLayout>
  );
};

export default ShareListPage;
