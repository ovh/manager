import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { LB_DELETE_FEATURE } from '../home/iplb-home.constants';
import { IPLB_GUIDES, SERVICE_TYPE } from '../iplb.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('iplb.index', {
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
        header: /* @ngInject */ ($translate) =>
          $translate.instant('iplb_title'),
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
          IPLB_GUIDES[coreConfig.getUser().ovhSubsidiary] ||
          IPLB_GUIDES.DEFAULT,
      },
      redirectTo: (transition) =>
        transition
          .injector()
          .getAsync('resources')
          .then((resources) =>
            resources.data.length === 0 ? { state: 'iplb.onboarding' } : false,
          ),
    })
    .state('iplb.index.terminate', {
      url: '/terminate/:id',
      views: {
        modal: {
          component: 'billingAutorenewTerminateAgoraService',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        serviceType: () => SERVICE_TYPE,
        subscriptionInfo: /* @ngInject */ (
          $transition$,
          IpLoadBalancerService,
        ) => IpLoadBalancerService.getSubscription($transition$.params().id),
        id: /* @ngInject */ (subscriptionInfo) => subscriptionInfo.serviceId,
        goBack: /* @ngInject */ ($state, Alerter) => (message, type) => {
          const promise = $state.go('iplb.index');
          if (message) {
            if (type === 'danger') Alerter.error(message, 'InfoErrors');
            else Alerter.success(message, 'InfoErrors');
          }

          return promise;
        },
      },
    });
};
