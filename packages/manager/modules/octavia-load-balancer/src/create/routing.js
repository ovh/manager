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
      trackingProductPage: () =>
        `${TRACKING_CHAPTER_1}::${TRACKING_NAME}::goto-product-page`,
    },
  });
};
