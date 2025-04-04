import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { LB_DELETE_FEATURE } from '../home/iplb-home.constants';
import { IPLB_GUIDES } from '../iplb.constant';

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
      header: /* @ngInject */ ($translate) => $translate.instant('iplb_title'),
      changelog: () => 'iplb',
      customizableColumns: () => true,
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
      guideLinks: /* @ngInject */ (coreConfig) =>
        IPLB_GUIDES[coreConfig.getUser().ovhSubsidiary] || IPLB_GUIDES.DEFAULT,
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.data.length === 0 ? { state: 'iplb.onboarding' } : false,
        ),
  });
};
