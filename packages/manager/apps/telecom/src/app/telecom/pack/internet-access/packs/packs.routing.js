import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { packXdsl } from '@ovh-ux/manager-product-listing-configuration';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.packs.internet-access.packs', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    params: ListLayoutHelper.stateParams,
    component: 'managerListLayout',
    resolve: {
      apiPath: () => '/pack/xdsl',
      loadResource: /* @ngInject */ (OvhApiPackXdsl) => (resource) =>
        OvhApiPackXdsl.Access()
          .v6()
          .getServices({
            packId: resource.packName,
          })
          .$promise.then((services) => ({
            ...resource,
            numServices: services.length,
          }))
          .catch(() => resource),

      schema: /* @ngInject */ ($http) =>
        $http.get('/pack/xdsl.json').then(({ data }) => data),
      dataModel: /* @ngInject */ (schema) =>
        schema.models['pack.xdsl.PackAdsl'],
      id: () => 'telephony-packs',
      columnConfig: () => packXdsl.getConfig(),
      ...ListLayoutHelper.stateResolves,

      getServiceNameLink: /* @ngInject */ ($state) => ({ packName }) =>
        $state.href('telecom.packs.pack', {
          packName,
        }),

      viewPack: /* @ngInject */ ($state) => ({ packName }) =>
        $state.go('telecom.packs.pack', {
          packName,
        }),

      options: /* @ngInject */ ($translate, viewPack) => [
        {
          id: 'details',
          label: $translate.instant('packs_view_label'),
          callback: (item) => viewPack(item),
        },
      ],
    },
  });
};
