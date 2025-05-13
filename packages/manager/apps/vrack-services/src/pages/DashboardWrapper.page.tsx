import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Outlet, useLocation } from 'react-router-dom';
import { useOvhTracking, ButtonType } from '@ovh-ux/manager-react-shell-client';
import { ErrorBanner } from '@ovh-ux/manager-react-components';
import {
  useVrackService,
  useVrackServicesList,
} from '@ovh-ux/manager-network-common';
import { DashboardLayout } from '@/components/layout-helpers';
import NotFound from '@/pages/not-found/404.page';
import { urls } from '@/routes/routes.constants';
import { DashboardTabItemProps } from '@/components/layout-helpers/layout-helpers.type';

export default function DashboardWrapper() {
  const { t } = useTranslation('vrack-services/dashboard');
  const { id } = useParams();
  const location = useLocation();
  const { trackClick } = useOvhTracking();
  const { data, isLoading } = useVrackServicesList();
  const { isError, error } = useVrackService();

  const tabList: DashboardTabItemProps[] = React.useMemo(
    () => [
      {
        name: 'overview',
        title: t('overviewTabLabel'),
        to: urls.overview.replace(':id', id),
        pathMatchers: [urls.overviewAssociate, urls.overview].map(
          (path) => new RegExp(`${path.replace(':id', id)}$`),
        ),
        onClick: () => {
          trackClick({
            buttonType: ButtonType.tab,
            actionType: 'navigation',
            actions: ['overview'],
          });
        },
      },
      {
        name: 'subnets',
        title: t('subnetsTabLabel'),
        to: urls.subnets.replace(':id', id),
        pathMatchers: [
          urls.subnets,
          urls.subnetsDelete,
          urls.subnetsListing,
          urls.subnetsOnboarding,
        ].map(
          (path) =>
            new RegExp(path.replace(':id', id).replace(':cidr', '\\S+')),
        ),
        onClick: () => {
          trackClick({
            buttonType: ButtonType.tab,
            actionType: 'navigation',
            actions: ['subnets'],
          });
        },
      },
      {
        name: 'endpoints',
        title: t('endpointsTabLabel'),
        to: urls.endpoints.replace(':id', id),
        pathMatchers: [
          urls.endpoints,
          urls.endpointsDelete,
          urls.endpointsListing,
          urls.endpointsOnboarding,
        ].map(
          (path) => new RegExp(path.replace(':id', id).replace(':urn', '\\S+')),
        ),
        onClick: () => {
          trackClick({
            buttonType: ButtonType.tab,
            actionType: 'navigation',
            actions: ['endpoints'],
          });
        },
      },
    ],
    [id],
  );

  if (isError) {
    return <ErrorBanner error={error} />;
  }

  if (
    !isLoading &&
    !data?.data?.find((vrackServices) => vrackServices.id === id)
  ) {
    return <NotFound />;
  }

  return [urls.createEndpoint, urls.createSubnet]
    .map((url) => url.replace(':id', id))
    .includes(location.pathname) ? (
    <React.Suspense>
      <Outlet />
    </React.Suspense>
  ) : (
    <DashboardLayout tabs={tabList} />
  );
}
