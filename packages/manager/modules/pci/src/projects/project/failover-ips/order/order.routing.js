import filter from 'lodash/filter';
import get from 'lodash/get';

const REGIONS = {
  EU: 'EUROPE',
  CA: 'CANADA',
  US: 'USA',
};

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
      products: (OvhApiOrderCatalogFormatted) =>
        OvhApiOrderCatalogFormatted.v6()
          .get({
            catalogName: 'ip',
            ovhSubsidiary: coreConfigProvider.getUser().ovhSubsidiary,
          })
          .$promise.then(({ plans }) =>
            filter(
              plans,
              (offer) =>
                /failover/.test(offer.planCode) &&
                offer.invoiceName.includes(
                  get(REGIONS, coreConfigProvider.getRegion()),
                ),
            ),
          ),

      goBack: /* @ngInject */ (goToFailoverIps) => goToFailoverIps,
    },
  });
};
