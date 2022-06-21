export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nasha.order', {
    url: '/order',
    component: 'nashaOrder',
    resolve: {
      breadcrumb: () => null,
      cancelLink: /* @ngInject */ ($state) => $state.href('nasha'),
      plans: /* @ngInject */ ($http, coreConfig, preparePlans) =>
        $http
          .get(
            `/order/catalog/public/f4a53r9w?ovhSubsidiary=${
              coreConfig.getUser().ovhSubsidiary
            }`,
          )
          .then(({ data: catalog }) => preparePlans(catalog)),
    },
  });
};
