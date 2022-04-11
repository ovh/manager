import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { GUIDELINK } from './cloud-connect.constants';

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
        viewDetail: /* @ngInject */ ($state) => ({ uuid: ovhCloudConnectId }) =>
          $state.go('cloud-connect.details', {
            ovhCloudConnectId,
          }),
        hideBreadcrumb: () => true,
      },
    });
};
