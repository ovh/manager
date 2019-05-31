import filter from 'lodash/filter';
import find from 'lodash/find';
import map from 'lodash/map';

export default /* @ngInject */ ($stateProvider, coreConfigProvider) => {
  if (!coreConfigProvider.isRegion('US')) {
    $stateProvider
      .state('pci.projects.project.failover-ips.order', {
        url: '/order',
        layout: 'modal',
        views: {
          modal: {
            component: 'pciProjectFailoverIpsLegacyOrder',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ () => null,
          regions: /* @ngInject */ (
            OvhApiCloudProjectRegion,
            projectId,
          ) => OvhApiCloudProjectRegion.v6().query({
            serviceName: projectId,
          }).$promise
            .then(regions => Promise.all(map(regions, id => OvhApiCloudProjectRegion.v6().get({
              serviceName: projectId,
              id,
            }).$promise))),

          instances: /* @ngInject */ (
            OvhApiCloudProject,
            projectId,
          ) => OvhApiCloudProject
            .Instance()
            .v6()
            .query({
              serviceName: projectId,
            })
            .$promise
            .then(instances => filter(
              instances,
              ({ ipAddresses }) => find(ipAddresses, { type: 'public' }),
            )),

          goBack: /* @ngInject */ goToFailoverIps => goToFailoverIps,
        },

      });
  } else {
    $stateProvider
      .state('pci.projects.project.failover-ips.order', {
        url: '/order',
        layout: 'modal',
        views: {
          modal: {
            component: 'pciProjectFailoverIpsAgoraOrder',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ () => null,
          products: /* @ngInject */
            OvhApiOrderCatalogFormatted => OvhApiOrderCatalogFormatted.v6().get({
              catalogName: 'ip',
              ovhSubsidiary: 'US',
            }).$promise
              .then(({ plans }) => filter(plans, offer => /failover/.test(offer.planCode) && /USA/.test(offer.invoiceName))),


          instances: /* @ngInject */ (
            OvhApiCloudProject,
            projectId,
          ) => OvhApiCloudProject
            .Instance()
            .v6()
            .query({
              serviceName: projectId,
            })
            .$promise,

          goBack: /* @ngInject */ goToFailoverIps => goToFailoverIps,
        },

      });
  }
};
