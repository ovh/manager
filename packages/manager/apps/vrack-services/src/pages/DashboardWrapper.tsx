import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Outlet, useLocation } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout-helpers';
import { useVrackService, useVrackServicesList } from '@/utils/vs-utils';
import NotFound from '@/pages/404';
import { ErrorPage } from '@/components/Error';
import { urls } from '@/router/constants';
import { DashboardTabItemProps } from '@/components/layout-helpers/layout-helpers.type';

export default function DashboardWrapper() {
  const { t } = useTranslation('vrack-services/dashboard');
  const { id } = useParams();
  const location = useLocation();
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
      },
    ],
    [id],
  );

  if (isError) {
    return <ErrorPage error={error} />;
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
