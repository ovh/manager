import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.packs.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    params: ListLayoutHelper.stateParams,
    component: 'telecomPackInternetAccessPacks',
    resolve: {
      apiPath: () => '/pack/xdsl',
      ...ListLayoutHelper.stateResolves,
      defaultFilterColumn: () => 'packName',
      dataModel: () => 'pack.xdsl.PackAdsl',
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
      getPackLink: /* @ngInject */ ($state) => ({ packName }) =>
        $state.href('telecom.packs.pack', {
          packName,
        }),
      viewPack: /* @ngInject */ ($state) => ({ packName }) =>
        $state.go('telecom.packs.pack', {
          packName,
        }),
      hideBreadcrumb: () => true,
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.data.length === 0 ? 'telecom.packs.onboarding' : false,
        ),
  });
};
