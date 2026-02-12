import React from 'react';

import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  BADGE_SIZE,
  Badge,
  Button,
  ICON_NAME,
  Icon,
  Tab,
  TabList,
  Tabs,
  type TabsValueChangeEvent,
  Text,
} from '@ovhcloud/ods-react';

import { Notifications } from '@ovh-ux/muk';

import { ActionLink } from '@/components/action-link/ActionLink.component';
import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb.component';
import { useShare } from '@/data/hooks/shares/useShare';
import { useShareParams } from '@/hooks/useShareParams';
import { selectShareDetails } from '@/pages/dashboard/view-model/shareDetails.view-model';
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
  const { t } = useTranslation(['dashboard']);
  const { region, shareId } = useShareParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { data: shareDetails } = useShare(region, shareId, {
    select: selectShareDetails,
  });

  const currentTab = getTabValueFromPathname(location.pathname);

  const handleTabChange = (event: TabsValueChangeEvent) => {
    const value = event.value;
    if (value === TAB_SNAPSHOTS || value === TAB_ACL) {
      return;
    }
    navigate(value === TAB_GENERAL ? '.' : value);
  };

  return (
    <main className="flex flex-col gap-6 px-4 py-8 md:px-10 md:py-9">
      <Breadcrumb items={[{ label: shareDetails?.name ?? '' }]} />

      <header className="flex flex-col gap-8">
        <div className="flex items-center gap-2">
          <Text preset="heading-2">{shareDetails?.name ?? ''}</Text>
          <Button
            type="button"
            variant="ghost"
            color="primary"
            size="sm"
            aria-label={t('dashboard:actions.edit_name')}
            className="flex items-center"
          >
            <Icon name={ICON_NAME.pen} />
          </Button>
        </div>
        <ActionLink
          path=".."
          className="flex w-fit items-center gap-2"
          label={t('dashboard:actions.back')}
          withBackArrow
        />
      </header>

      <div>
        <Notifications />
      </div>

      <nav aria-label={t('dashboard:tabs.general')}>
        <Tabs value={currentTab} onValueChange={handleTabChange}>
          <TabList className="w-fit">
            <Tab value={TAB_GENERAL} id="tab-general">
              {t('dashboard:tabs.general')}
            </Tab>
            <Tab value={TAB_SNAPSHOTS} id="tab-snapshots" disabled className="flex gap-4">
              {t('dashboard:tabs.snapshots')}
              <Badge size={BADGE_SIZE.sm}>Comming soon</Badge>
            </Tab>
            <Tab value={TAB_ACL} id="tab-acl" disabled>
              {t('dashboard:tabs.acl')}
            </Tab>
          </TabList>
        </Tabs>
      </nav>

      <Outlet />
    </main>
  );
};

export default DashboardLayout;
