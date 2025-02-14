import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import {
  GUIDELINK,
  TRACKING_PREFIX,
  TRACKING_CONTEXT,
} from './cloud-connect.constants';
import { getCloudConnectOrderUrl } from './cloud-connect.order';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('cloud-connect', {
      url: '/cloud-connect',
      template: '<div ui-view></div>',
      resolve: {
        user: /* @ngInject */ (OvhApiMe) => OvhApiMe.v6().get().$promise,
        guideUrl: /* @ngInject */ (user) =>
          GUIDELINK[user.ovhSubsidiary] || GUIDELINK.GB,
        breadcrumb: () => 'OVHcloud Connect',
      },
    })
    .state('cloud-connect.index', {
      url: `?${ListLayoutHelper.urlQueryParams}`,
      component: 'cloudConnect',
      params: ListLayoutHelper.stateParams,
      resolve: {
        ...ListLayoutHelper.stateResolves,
        apiPath: () => '/ovhCloudConnect',
        dataModel: () => 'ovhcloudconnect.Service',
        defaultFilterColumn: () => 'uuid',
        getServiceNameLink: /* @ngInject */ ($state) => ({
          uuid: ovhCloudConnectId,
        }) =>
          $state.href('cloud-connect.details', {
            ovhCloudConnectId,
          }),
        viewDetail: /* @ngInject */ ($state, atInternet) => ({
          uuid: ovhCloudConnectId,
        }) => {
          atInternet.trackClick({
            name: `${TRACKING_PREFIX} + 'datagrid::button::viewDetail'`,
            type: 'action',
            ...TRACKING_CONTEXT,
          });
          $state.go('cloud-connect.details', {
            ovhCloudConnectId,
          });
        },
        hideBreadcrumb: () => true,
        goToManageNotifications: /* @ngInject */ ($state, atInternet) => (
          service,
        ) => {
          atInternet.trackClick({
            name: `${TRACKING_PREFIX} + 'datagrid::button::goToManageNotifications'`,
            type: 'action',
            ...TRACKING_CONTEXT,
          });
          $state.go('cloud-connect.index.managenotifications', {
            uuid: service.uuid,
            description: service.description,
          });
        },
        gotoOrder: /* @ngInject */ ($window, coreConfig, atInternet) => () => {
          atInternet.trackClick({
            name: `${TRACKING_PREFIX} + 'page::button::go-to-order_cloud-connect'`,
            type: 'action',
            ...TRACKING_CONTEXT,
          });
          $window.open(
            getCloudConnectOrderUrl(coreConfig.getUser().ovhSubsidiary),
            '_blank',
          );
        },
        orderFollowUp: /* @ngInject */ (cloudConnectService) =>
          cloudConnectService.getOrderFollowUp(),
      },
      redirectTo: (transition) =>
        transition
          .injector()
          .get('$q')
          .all([
            transition.injector().getAsync('resources'),
            transition.injector().getAsync('orderFollowUp'),
          ])
          .then(([resources, orderFollowUp]) =>
            resources.data.length === 0 && !orderFollowUp.length
              ? { state: 'cloud-connect.onboarding' }
              : false,
          ),
      atInternet: {
        ignore: true,
      },
    });
};
