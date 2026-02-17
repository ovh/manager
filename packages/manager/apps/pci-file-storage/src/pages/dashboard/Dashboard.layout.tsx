import React from 'react';

import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  BADGE_SIZE,
  Badge,
  Tab,
  TabList,
  Tabs,
  type TabsValueChangeEvent,
} from '@ovhcloud/ods-react';

import { BaseLayout, ChangelogMenu, GuideMenu } from '@ovh-ux/muk';

import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb.component';
import { CHANGELOG_LINKS } from '@/constants/Changelog.constants';
import { useShare } from '@/data/hooks/shares/useShare';
import { useShareParams } from '@/hooks/useShareParams';
import { ShareEditableName } from '@/pages/dashboard/ShareEditableName/ShareEditableName.component';
import { selectShareDetails } from '@/pages/dashboard/view-model/shareDetails.view-model';
import { useFileStorageGuideItems } from '@/pages/view-model/guides.view-model';
import { subRoutes } from '@/routes/Routes.constants';

const TAB_GENERAL = '';
const TAB_SNAPSHOTS = subRoutes.shareSnapshots;
const TAB_ACL = subRoutes.shareAcl;

const getTabValueFromPathname = (pathname: string): string => {
  if (pathname.endsWith(`/${TAB_SNAPSHOTS}`)) {
    return TAB_SNAPSHOTS;
  }
  if (pathname.endsWith(`/${TAB_ACL}`)) {
    return TAB_ACL;
  }
  return TAB_GENERAL;
};

const DashboardLayout: React.FC = () => {
  const { t } = useTranslation(['dashboard', 'guides']);
  const { region, shareId } = useShareParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { data: shareDetails } = useShare(region, shareId, {
    select: selectShareDetails,
  });

  const guideItems = useFileStorageGuideItems();

  const currentTab = getTabValueFromPathname(location.pathname);

  const handleTabChange = (event: TabsValueChangeEvent) => {
    const value = event.value;
    if (value === TAB_SNAPSHOTS) {
      return;
    }
    navigate(value === TAB_GENERAL ? '.' : value);
  };

  const handleRenameSubmit = (name: string) => {
    // TODO: Implement API call to rename share
    console.log('Rename share to:', name);
  };

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb items={[{ label: shareDetails?.name ?? '' }]} />}
      header={{
        title: <ShareEditableName name={shareDetails?.name ?? null} onSubmit={handleRenameSubmit} />,
        guideMenu: <GuideMenu items={guideItems} />,
        changelogButton: <ChangelogMenu links={CHANGELOG_LINKS} />,
      }}
      backLink={{
        label: t('dashboard:actions.back'),
        onClick: () => navigate('..'),
      }}
      tabs={
        <nav aria-label={t('dashboard:tabs.general')}>
          <Tabs value={currentTab} onValueChange={handleTabChange}>
            <TabList className="w-fit">
              <Tab value={TAB_GENERAL} id="tab-general">
                {t('dashboard:tabs.general')}
              </Tab>
              <Tab value={TAB_SNAPSHOTS} id="tab-snapshots" disabled className="flex gap-4">
                {t('dashboard:tabs.snapshots')}
                <Badge size={BADGE_SIZE.sm} className="font-normal">
                  {t('common.coming_soon')}
                </Badge>
              </Tab>
              <Tab value={TAB_ACL} id="tab-acl">
                {t('dashboard:tabs.acl')}
              </Tab>
            </TabList>
          </Tabs>
        </nav>
      }
    >
      <Outlet />
    </BaseLayout>
  );
};

export default DashboardLayout;
