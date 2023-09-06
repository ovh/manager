import { ApiV2ListHelper } from '../../ng-apiv2-helper/src';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vrack-services', {
    url: '/vrack-services',
    template: `<div data-ui-view></div>`,
    redirectTo: 'vrack-services.index',
    resolve: {
      apiPath: () => '/vrackServices/resource',
      createItemsPromise: /* @ngInject */ ($q, apiPath, Apiv2Service) => ({
        cursor,
      }) => {
        if (!apiPath) return $q.promise([]);
        return Apiv2Service.httpApiv2List(
          { url: `/engine/api/v2${apiPath}`, params: {} },
          { cursor },
        ).then(({ data, ...rest }) => ({
          ...rest,
          data,
        }));
      },
      hideBreadcrumb: () => true,
      breadcrumb: () => 'vRack Services',
    },
  });

  $stateProvider.state('vrack-services.index', {
    url: `?cursors`,
    component: 'apiV2ListLayout',
    params: ApiV2ListHelper.stateParams,
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('createItemsPromise')
        .then((getResources) => {
          return getResources({}).then(({ data }) => {
            return !Array.isArray(data) || data.length === 0
              ? {
                  state: 'vrack-services.onboarding',
                }
              : false;
          });
        }),
    resolve: {
      ...ApiV2ListHelper.stateResolves,
      pageSize: () => 25,
      header: () => 'vRack Services',
      description: () =>
        'Auto generated list page which list the main resource using the cursor style apiv2 listing',
      columns: () => [
        {
          title: 'id',
          property: 'id',
        },
      ],
      customizableColumns: () => true,
      linkProperty: () => 'id',
      resourceIdProperty: () => 'id',
      getResourceLink: /* @ngInject */ ($state) => (resourceId) => {
        return $state.href('vrack-services.dashboard', { resourceId });
      },
      hideBreadcrumb: () => true,
    },
  });
};
