import {
  TRACKING_NAME,
  SIZE_FLAVOUR_REGEX,
  AGORA_ADDON_FAMILY,
  AGORA_GATEWAY_REGEX,
  AGORA_FLOATING_IP_REGEX,
} from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('octavia-load-balancer.create', {
    url: '/create',
    views: {
      octaviaLoadBalancerView: 'octaviaLoadBalancerCreate',
    },
    atInternet: {
      rename: TRACKING_NAME,
    },
    resolve: {
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('octavia_load_balancer_create_title'),
      catalog: /* @ngInject */ ($http, coreConfig) =>
        $http
          .get(
            `/order/catalog/public/cloud?ovhSubsidiary=${
              coreConfig.getUser().ovhSubsidiary
            }`,
          )
          .then(({ data }) => data),
      sizeFlavour: /* @ngInject */ (catalog) =>
        catalog.addons.reduce((filtered, addon) => {
          const found = addon.planCode.match(SIZE_FLAVOUR_REGEX);
          if (found) {
            filtered.push({
              code: found[1],
              price: addon.pricings[0].price,
              label: found[1].toUpperCase(),
              technicalName: addon.blobs.technical.name,
            });
          }
          return filtered;
        }, []),
      catalogGateway: /* @ngInject */ (catalog) =>
        catalog.addons.filter((addon) =>
          addon.planCode.match(AGORA_GATEWAY_REGEX),
        )[0],
      catalogFloatingIp: /* @ngInject */ (catalog) =>
        catalog.addons.filter((addon) =>
          addon.planCode.match(AGORA_FLOATING_IP_REGEX),
        )[0],
      regionsPlansGroupBySize: /* @ngInject */ (
        $http,
        $q,
        projectId,
        coreConfig,
      ) =>
        $q
          .all({
            plans: $http.get(
              `/cloud/project/${projectId}/capabilities/productAvailability?addonFamily=${AGORA_ADDON_FAMILY}&ovhSubsidiary=${
                coreConfig.getUser().ovhSubsidiary
              }`,
            ),
            privateNetworks: $http.get(
              `/cloud/project/${projectId}/network/private`,
            ),
          })
          .then(({ plans, privateNetworks }) =>
            // Get only hourly plans and format them
            plans.data.plans.reduce((filtered, plan) => {
              const found = plan.code.match(SIZE_FLAVOUR_REGEX);
              if (found) {
                // If there is no private network for this region, we disable it
                const mappedRegionPlans = plan.regions.map((region) => {
                  const isRegionEnable = privateNetworks.data.some(
                    (privateNetwork) =>
                      privateNetwork.regions.some(
                        (privateNetworkRegion) =>
                          privateNetworkRegion.region === region.name,
                      ),
                  );
                  return {
                    ...region,
                    hasEnoughQuota: () => isRegionEnable,
                  };
                });

                filtered.push({
                  size: found[1],
                  regions: mappedRegionPlans,
                });
              }
              return filtered;
            }, []),
          ),
      privateNetworkCreationLink: /* @ngInject */ (
        $q,
        projectId,
        coreURLBuilder,
      ) =>
        $q.when(
          coreURLBuilder.buildURL(
            'public-cloud',
            `#/pci/projects/${projectId}/private-networks/new`,
          ),
        ),
      creationPageLink: /* @ngInject */ ($state, projectId) =>
        $state.href('octavia-load-balancer.create', {
          projectId,
        }),
    },
  });
};
