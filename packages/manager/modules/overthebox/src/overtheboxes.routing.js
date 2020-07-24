import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { overTheBox } from '@ovh-ux/manager-product-listing-configuration';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('overTheBoxes.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    component: 'managerListLayout',
    params: ListLayoutHelper.stateParams,
    resolve: {
      apiPath: () => '/overTheBox',
      ...ListLayoutHelper.stateResolves,
      schema: /* @ngInject */ (OvhApiOverTheBox) =>
        OvhApiOverTheBox.v6().schema().$promise,
      dataModel: /* @ngInject */ (schema) =>
        schema.models['overTheBox.Service'],
      columnConfig: () => overTheBox.getConfig(),
      header: /* @ngInject */ ($translate) =>
        $translate.instant('overtheboxes_title'),
      id: () => 'overtheboxes',
      defaultFilterProperty: () => 'serviceName',

      getServiceNameLink: /* @ngInject */ ($state) => ({ serviceName }) =>
        $state.href('overTheBoxes.overTheBox.details', {
          serviceName,
        }),

      options: /* @ngInject */ ($translate, viewOverthebox) => [
        {
          id: 'details',
          label: $translate.instant('overtheboxes_view_overthebox_label'),
          callback: (value) => viewOverthebox(value),
        },
      ],
      viewOverthebox: /* @ngInject */ ($state) => ({ serviceName }) =>
        $state.go('overTheBoxes.overTheBox.details', {
          serviceName,
        }),
    },
  });
};
