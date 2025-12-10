import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  useResolvedPath,
  useLocation,
  Outlet,
  useNavigate,
} from 'react-router-dom';
import { OdsTabs, OdsTab } from '@ovhcloud/ods-components/react';
import { BaseLayout, Notifications } from '@ovh-ux/manager-react-components';
import { subRoutes } from '@/routes/routes.constant';
import { useHeader } from '@/components/Header/Header';
import { SurveyLink } from '@/components/SurveyLink/SurveyLink';

export type DashboardTabItemProps = {
  name: string;
  title: string;
  to: string;
};

export default function Listing() {
  const { t } = useTranslation('listing');

  const location = useLocation();
  const header = useHeader(t('title'));
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
  ];

  return (
    <BaseLayout
      header={header}
      tabs={
        <>
          <div className=" w-full flex justify-end">
            <SurveyLink />
          </div>
          <OdsTabs className="mb-4">
            {tabsList.map((tab: DashboardTabItemProps) => (
              <OdsTab
                key={`ods-tab-bar-item-${tab.to}`}
                id={tab.to}
                isSelected={[tab.to, `${tab.to}/`].includes(location.pathname)}
                className="flex items-center justify-center"
                title={tab.title}
                onClick={() => navigate(tab.to)}
              >
                {tab.title}
              </OdsTab>
            ))}
          </OdsTabs>
        </>
      }
      message={<Notifications />}
    >
      <Outlet />
    </BaseLayout>
  );
}
