export default /* @ngInject */ ($stateProvider, coreConfigProvider) => {
  $stateProvider.state('pci.projects.project.failover-ips.order', {
    url: '/order',
    layout: 'modal',
    views: {
      modal: {
        component: 'pciProjectFailoverIpsOrderOrder',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ () => null,
      /* @ngInject */
      products: /* @ngInject */ (
        availableRegionsForOrder,
        OvhApiOrderCatalogFormatted,
      ) =>
        OvhApiOrderCatalogFormatted.v6()
          .get({
            catalogName: 'ip',
            ovhSubsidiary: coreConfigProvider.getUser().ovhSubsidiary,
          })
          .$promise.then(({ plans }) =>
            plans.filter(
              (offer) =>
                /failover/.test(offer.planCode) &&
                availableRegionsForOrder.some((region) =>
                  offer.invoiceName.includes(region),
                ),
            ),
          ),

      goBack: /* @ngInject */ (goToFailoverIps) => goToFailoverIps,
    },
  });
};
