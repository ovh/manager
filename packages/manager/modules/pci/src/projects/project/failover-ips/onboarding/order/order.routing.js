import filter from 'lodash/filter';
import map from 'lodash/map';

export default /* @ngInject */ ($stateProvider, coreConfigProvider) => {
  if (!coreConfigProvider.isRegion('US')) {
    $stateProvider.state('pci.projects.project.failover-ips.onboarding.order', {
      url: '/order',
      layout: 'modal',
      views: {
        modal: {
          component: 'pciProjectFailoverIpsLegacyOrder',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ () => null,
        regions: /* @ngInject */ (OvhApiCloudProjectRegion, projectId) =>
          OvhApiCloudProjectRegion.v6()
            .query({
              serviceName: projectId,
            })
            .$promise.then((regions) =>
              Promise.all(
                map(
                  regions,
                  (id) =>
                    OvhApiCloudProjectRegion.v6().get({
                      serviceName: projectId,
                      id,
                    }).$promise,
                ),
              ),
            ),

        goBack: /* @ngInject */ (goToFailoverIpsOnboarding) =>
          goToFailoverIpsOnboarding,
      },
    });
  } else {
    $stateProvider.state('pci.projects.project.failover-ips.onboarding.order', {
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
              ovhSubsidiary: 'US',
            })
            .$promise.then(({ plans }) =>
              filter(
                plans,
                (offer) =>
                  /failover/.test(offer.planCode) &&
                  /USA/.test(offer.invoiceName),
              ),
            ),

        goBack: /* @ngInject */ (goToFailoverIpsOnboarding) =>
          goToFailoverIpsOnboarding,
      },
    });
  }
};
