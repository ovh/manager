import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.private-database.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    component: 'managerListLayout',
    params: ListLayoutHelper.stateParams,
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('noFilterPrivateDatabase')
        .then((noFilterPrivateDatabase) =>
          noFilterPrivateDatabase.data.length === 0
            ? { state: 'app.private-database.onboarding' }
            : false,
        ),
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '/hosting/privateDatabase',
      dataModel: () => 'hosting.privateDatabase.Service',
      noFilterPrivateDatabase: /* @ngInject */ ($http) =>
        $http.get('/hosting/privateDatabase'),
      defaultFilterColumn: () => 'serviceName',
      header: /* @ngInject */ ($translate) =>
        $translate.instant('private_databases_title'),
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({
        serviceName: productId,
      }) =>
        $state.href('app.private-database.dashboard', {
          productId,
        }),
      topbarOptions: /* @ngInject */ ($translate, $state, atInternet) => ({
        cta: {
          type: 'button',
          displayed: true,
          disabled: false,
          label: $translate.instant('private_databases_order'),
          value: $translate.instant('private_databases_order'),
          onClick: () => {
            atInternet.trackClick({
              name: 'web::private-database::index::order',
              type: 'action',
            });
            $state.go('app.private-database-order-clouddb');
          },
        },
      }),
      hideBreadcrumb: () => true,
    },
  });
};
