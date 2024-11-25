import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { LB_DELETE_FEATURE } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iplb.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    views: {
      iplbContainer: {
        component: 'iplbListing',
      },
    },
    params: ListLayoutHelper.stateParams,
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '/ipLoadbalancing',
      dataModel: () => 'ipLoadbalancing.Ip',
      defaultFilterColumn: () => 'serviceName',
      getServiceNameLink: /* @ngInject */ ($state) => ({ serviceName }) =>
        $state.href('iplb.detail', {
          serviceName,
        }),
      breadcrumb: () => null,
      hideBreadcrumb: () => true,
      isDeleteOptionsAvailable: /* @ngInject */ (ovhFeatureFlipping) => {
        return ovhFeatureFlipping
          .checkFeatureAvailability([LB_DELETE_FEATURE])
          .then((featureAvailability) =>
            featureAvailability.isFeatureAvailable(LB_DELETE_FEATURE),
          )
          .catch(() => false);
      },
      header: /* @ngInject */ ($translate) => $translate.instant('iplb_title'),
    },
  });
};
