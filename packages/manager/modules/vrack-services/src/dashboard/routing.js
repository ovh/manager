export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vrack-services.dashboard', {
    url: '/:resourceId',
    component: 'vrackServices',
    resolve: {
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      dashboardLink: /* @ngInject */ ($state, resourceId) =>
        $state.href('vrack-services.dashboard', {
          resourceId,
        }),
      subnetLink: /* @ngInject */ ($state) =>
        $state.href('vrack-services.dashboard'), // TODO: Change link
      endpointsLink: /* @ngInject */ ($state) =>
        $state.href('vrack-services.dashboard'), // TODO: Change link
      resourceId: /* @ngInject */ ($transition$) =>
        $transition$.params().resourceId,
      // TODO: use this resource resolver when apiV2 is ready
      // resource: /* @ngInject */ (Apiv2Service, apiPath, resourceId) =>
      //   Apiv2Service.httpApiv2({
      //     method: 'get',
      //     url: `/engine/api/v2${apiPath}/${resourceId}`,
      //   }).then(({ data }) => data),
      resource: /* @ngInject */ (resourceId) => {
        // TODO: use API Call when api is ready
        return {
          id: resourceId,
          currentState: {
            displayName: 'vRack-serviceName',
            productStatus: 'ACTIVE',
            zone: 'RBX-1',
            vrackId: 'pn-123456',
          },
          createdAt: '2023-07-20T07:27:57.866Z',
        };
      },
      vrackLink: /* @ngInject */ ($injector, $q, coreURLBuilder, resource) => {
        if ($injector.has('shellClient')) {
          return $injector
            .get('shellClient')
            .navigation.getURL(
              'dedicated',
              `#/vrack/${resource.currentState.vrackId}`,
            );
        }
        return $q.when(
          coreURLBuilder.buildURL(
            'dedicated',
            `#/vrack/${resource.currentState.vrackId}`,
          ),
        );
      },
      breadcrumb: /* @ngInject */ (resourceId) => resourceId,
    },
  });
};
