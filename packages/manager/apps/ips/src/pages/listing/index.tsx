import {
  Outlet,
  useLocation,
  useNavigate,
  useResolvedPath,
} from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Tab, Tabs, TabList } from '@ovhcloud/ods-react';

import { BaseLayout, Notifications } from '@ovh-ux/muk';

import { useHeader } from '@/components/Header/Header';
import { SurveyLink } from '@/components/SurveyLink/SurveyLink';
import { subRoutes } from '@/routes/routes.constant';

export type DashboardTabItemProps = {
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
          <div className=" flex w-full justify-end">
            <SurveyLink />
          </div>
          <Tabs
            className="mb-4"
            value={
              location.pathname.endsWith('/')
                ? location.pathname.slice(0, -1)
                : location.pathname
            }
            onValueChange={(e) => {
              navigate(e.value);
            }}
          >
            <TabList>
              {tabsList.map((tab: DashboardTabItemProps) => (
                <Tab key={`ods-tab-bar-item-${tab.to}`} value={tab.to}>
                  {tab.title}
                </Tab>
              ))}
            </TabList>
          </Tabs>
        </>
      }
      message={<Notifications />}
    >
      <Outlet />
    </BaseLayout>
  );
}
