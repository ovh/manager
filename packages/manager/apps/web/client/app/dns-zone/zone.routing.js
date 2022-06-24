import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.zone.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    component: 'managerListLayout',
    params: ListLayoutHelper.stateParams,
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.data.length === 0
            ? { state: 'app.zone.onboarding' }
            : false,
        ),
    resolve: {
      ...ListLayoutHelper.stateResolves,
      schema: /* @ngInject */ ($http) =>
        $http.get('/domain.json').then(({ data }) => data),
      apiPath: () => '/domain/zone',
      dataModel: () => 'domain.zone.Zone',
      defaultFilterColumn: () => 'name',
      header: /* @ngInject */ ($translate) => $translate.instant('zones_title'),
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({ name: productId }) =>
        $state.href('app.zone.details', {
          productId,
        }),
      hideBreadcrumb: () => true,
    },
  });
};
