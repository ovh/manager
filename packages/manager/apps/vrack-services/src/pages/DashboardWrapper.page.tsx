import React from 'react';

import { Outlet, useLocation, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { useVrackService, useVrackServicesList } from '@ovh-ux/manager-network-common';
import { ButtonType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { Error } from '@ovh-ux/muk';

import {
  DashboardLayout,
  DashboardTabItemProps,
} from '@/components/layout-helpers/DashboardLayout.component';
import NotFound from '@/pages/not-found/Error404.page';
import { urls } from '@/routes/RoutesAndUrl.constants';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';

export default function DashboardWrapper() {
  const { t } = useTranslation(TRANSLATION_NAMESPACES.dashboard);
  const { id } = useParams();
  const location = useLocation();
  const { trackClick } = useOvhTracking();
  const { data, isLoading } = useVrackServicesList();
  const { isError, error } = useVrackService();

  const tabList: DashboardTabItemProps[] = React.useMemo(() => {
    const safeId = id || '';
    return [
      {
        name: 'overview',
        title: t('overviewTabLabel'),
        to: urls.overview.replace(':id', safeId),
        pathMatchers: [urls.overviewAssociate, urls.overview].map(
          (path) => new RegExp(`${path.replace(':id', safeId)}$`),
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
        to: urls.subnets.replace(':id', safeId),
        pathMatchers: [
          urls.subnets,
          urls.subnetsDelete,
          urls.subnetsListing,
          urls.subnetsOnboarding,
        ].map((path) => new RegExp(path.replace(':id', safeId).replace(':cidr', '\\S+'))),
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
        to: urls.endpoints.replace(':id', safeId),
        pathMatchers: [
          urls.endpoints,
          urls.endpointsDelete,
          urls.endpointsListing,
          urls.endpointsOnboarding,
        ].map((path) => new RegExp(path.replace(':id', safeId).replace(':urn', '\\S+'))),
        onClick: () => {
          trackClick({
            buttonType: ButtonType.tab,
            actionType: 'navigation',
            actions: ['endpoints'],
          });
        },
      },
    ];
  }, [id, trackClick, t]);

  if (isError) {
    return <Error error={error} />;
  }

  if (!isLoading && !data?.data?.find((vrackServices) => vrackServices.id === id)) {
    return <NotFound />;
  }

  const safeId = id || '';
  return [urls.createEndpoint, urls.createSubnet]
    .map((url) => url.replace(':id', safeId))
    .includes(location.pathname) ? (
    <React.Suspense>
      <Outlet />
    </React.Suspense>
  ) : (
    <DashboardLayout tabs={tabList} />
  );
}
