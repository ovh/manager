export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.order', {
    url: '/new',
    views: {
      netappContainer: {
        component: 'ovhManagerNetAppOrder',
      },
    },
    resolve: {
      catalog: /* @ngInject */ ($http, coreConfig) =>
        $http
          .get(
            `/order/catalog/public/netapp?ovhSubsidiary=${
              coreConfig.getUser().ovhSubsidiary
            }`,
          )
          .then(({ data }) => data),
      goBackLink: /* @ngInject */ ($state) => $state.href('netapp'),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('netapp_order'),
    },
  });
};
