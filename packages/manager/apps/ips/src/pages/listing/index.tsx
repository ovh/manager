import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  useResolvedPath,
  useLocation,
  Outlet,
  NavLink,
} from 'react-router-dom';
import { OdsTabs, OdsTab } from '@ovhcloud/ods-components/react';
import {
  BaseLayout,
  ChangelogButton,
  Notifications,
} from '@ovh-ux/manager-react-components';
import { CHANGELOG_LINKS } from '@/utils/changelog.constants';
import { subRoutes } from '@/routes/routes.constant';

export type DashboardTabItemProps = {
  name: string;
  title: string;
  to: string;
};

export default function Listing() {
  const { t } = useTranslation('listing');

  const location = useLocation();

  const tabsList = [
    {
      title: t('listingTabIpTitle'),
      to: useResolvedPath(subRoutes.root).pathname,
    },
    {
      title: t('listingTabManageIpOrganisationsTitle'),
      to: useResolvedPath(subRoutes.manageOrganisations).pathname,
    },
  ] as const;

  const header = {
    title: t('title'),
    changelogButton: <ChangelogButton links={CHANGELOG_LINKS} />,
  };

  return (
    <BaseLayout
      header={header}
      tabs={
        <OdsTabs className="mb-4">
          {tabsList.map((tab: DashboardTabItemProps) => (
            <OdsTab
              key={`ods-tab-bar-item-${tab.to}`}
              id={tab.to}
              isSelected={location.pathname === tab.to}
              className="flex items-center justify-center"
              title={tab.title}
            >
              <NavLink to={tab.to} className="flex no-underline">
                {tab.title}
              </NavLink>
            </OdsTab>
          ))}
        </OdsTabs>
      }
      message={<Notifications />}
    >
      <Outlet />
    </BaseLayout>
  );
}
