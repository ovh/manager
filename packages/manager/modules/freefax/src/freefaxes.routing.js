import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { freefax } from '@ovh-ux/manager-product-listing-configuration';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('freefaxes.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    component: 'managerListLayout',
    params: ListLayoutHelper.stateParams,
    resolve: {
      apiPath: () => '/freefax',
      columnConfig: () => freefax.getConfig(),
      schema: /* @ngInject */ ($http) =>
        $http.get('/freefax.json').then(({ data }) => data),
      dataModel: /* @ngInject */ (schema) =>
        schema.models['freefax.FreefaxProperties'],
      header: /* @ngInject */ ($translate) =>
        $translate.instant('freefaxes_title'),
      id: () => 'freefaxes',
      defaultFilterProperty: () => 'number',
      ...ListLayoutHelper.stateResolves,
      getServiceNameLink: /* @ngInject */ ($state) => (fax) =>
        $state.href('freefaxes.freefax', { serviceName: fax.number }),

      options: /* @ngInject */ ($translate, viewFreefax) => [
        {
          id: 'details',
          label: $translate.instant('freefaxes_view_freefax_label'),
          callback: (value) => viewFreefax(value),
        },
      ],
      viewFreefax: /* @ngInject */ ($state) => (fax) =>
        $state.go('freefaxes.freefax', { serviceName: fax.number }),
    },
  });
};
