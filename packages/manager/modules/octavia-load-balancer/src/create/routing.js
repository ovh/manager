import {
  TRACKING_NAME,
  TRACKING_CHAPTER_1,
  SIZE_FLAVOUR_REGEX,
} from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('octavia-load-balancer.create', {
    url: '/create',
    component: 'octaviaLoadBalancerCreate',
    atInternet: {
      rename: TRACKING_NAME,
    },
    resolve: {
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('octavia_load_balancer_create_title'),
      sizeFlavour: /* @ngInject */ ($http, coreConfig) =>
        $http
          .get(
            `/order/catalog/public/cloud?ovhSubsidiary=${
              coreConfig.getUser().ovhSubsidiary
            }`,
          )
          .then(({ data }) =>
            data.addons.reduce((filtered, addon) => {
              const regex = SIZE_FLAVOUR_REGEX;
              const found = addon.planCode.match(regex);
              if (found) {
                filtered.push({
                  code: found[1],
                  price: addon.pricings[0].price,
                  label: found[1].toUpperCase(),
                });
              }
              return filtered;
            }, []),
          ),
      regionsPlans: /* @ngInject */ ($http, $q, projectId, coreConfig) =>
        $q
          .all({
            plans: $http.get(
              `/cloud/project/${projectId}/capabilities/productAvailability?addonFamily=octavia-loadbalancer&ovhSubsidiary=${
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
                  let isRegionEnable = false;

                  privateNetworks.data.forEach((privateNetwork) => {
                    if (
                      privateNetwork.regions.some(
                        (privateNetworkRegion) =>
                          privateNetworkRegion.region === region.name,
                      )
                    ) {
                      isRegionEnable = true;
                    }
                  });

                  return {
                    ...region,
                    hasEnoughQuota: () => isRegionEnable,
                  };
                });

                filtered.push({
                  code: found[1],
                  regions: mappedRegionPlans,
                  disabled: false,
                });
              }
              return filtered;
            }, []),
          ),
      trackingProductPage: () =>
        `${TRACKING_CHAPTER_1}::${TRACKING_NAME}::goto-product-page`,
      trackingRegionAvailability: () =>
        `${TRACKING_CHAPTER_1}::${TRACKING_NAME}::goto-region-availability`,
    },
  });
};
