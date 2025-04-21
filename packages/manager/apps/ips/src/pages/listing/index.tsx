import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useResolvedPath,
  useLocation,
  Outlet,
  useNavigate,
} from 'react-router-dom';
import { OdsTabs, OdsTab } from '@ovhcloud/ods-components/react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  BaseLayout,
  ChangelogButton,
  GuideButton,
  GuideItem,
  Notifications,
} from '@ovh-ux/manager-react-components';
import { CHANGELOG_LINKS, GUIDES_LIST } from '@/utils/links.constants';
import { subRoutes } from '@/routes/routes.constant';

export type DashboardTabItemProps = {
  name: string;
  title: string;
  to: string;
};

export default function Listing() {
  const { t } = useTranslation('listing');

  const location = useLocation();
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const guideItems: GuideItem[] = [
    {
      id: 1,
      href: (GUIDES_LIST.documentation_link.url[ovhSubsidiary] ||
        GUIDES_LIST.documentation_link.url.DEFAULT) as string,
      target: '_blank',
      label: t('ips_dashboard_guide'),
    },
  ];
  const navigate = useNavigate();

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
    headerButton: <GuideButton items={guideItems} />,
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
              onClick={() => navigate(tab.to)}
            >
              {tab.title}
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
