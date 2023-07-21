<% const pascalcasedName = this.camelcase(name, { pascalCase: false }) -%>
export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dashboard', {
    url: '/:resourceId',
    component: '<%= pascalcasedName %>',
    resolve: {
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      dashboardLink: /* @ngInject */ ($state) => $state.href('app.dashboard'),
      resourceId: /* @ngInject */ ($transition$) =>
        $transition$.params().resourceId,
      breadcrumb: /* @ngInject */ (resourceId) => resourceId,
      /**
       * Loaded ApiV2 resource
       * @param {*} Apiv2Service
       * @param {*} apiPath path given in the parent root
       * @param {*} resourceId
       * @returns Promise returning resource datas
       */
      resource: /* @ngInject */ (Apiv2Service, apiPath, resourceId) =>
        Apiv2Service.httpApiv2({
          method: 'get',
          url: `/engine/api/v2${apiPath}/${resourceId}`,
        }).then(({ data }) => data),
    },
  });
};
