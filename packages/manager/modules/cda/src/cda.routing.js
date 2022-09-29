import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cda.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    views: {
      cdaDetails: {
        component: 'managerListLayout',
      },
    },
    params: ListLayoutHelper.stateParams,
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '/dedicated/ceph',
      dataModel: () => 'dedicated.ceph.clusterGet.response',
      defaultFilterColumn: () => 'serviceName',
      header: /* @ngInject */ ($translate) => $translate.instant('cda_title'),
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({ serviceName }) =>
        $state.href('cda.dashboard', {
          serviceName,
        }),
      topbarOptions: /* @ngInject */ ($translate, $window) => ({
        cta: {
          type: 'button',
          displayed: true,
          disabled: false,
          label: $translate.instant('cda_order'),
          value: $translate.instant('cda_order'),
          onClick: () => {
            $window.open('https://www.ovh.com/fr/cloud-disk-array/', '_blank');
          },
        },
      }),
      hideBreadcrumb: () => true,
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.data.length === 0 ? 'cda.onboarding' : false,
        ),
  });
};
