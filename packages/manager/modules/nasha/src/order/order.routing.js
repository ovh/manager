import { PRODUCT_ID } from './order.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nasha.order', {
    url: '/order',
    component: 'nashaOrder',
    resolve: {
      breadcrumb: () => null,
      goToNasha: /* @ngInject */ ($state) => () => $state.go('nasha'),
      plans: /* @ngInject */ ($http, coreConfig, preparePlans) =>
        $http
          .get(
            `/order/catalog/public/${PRODUCT_ID}?ovhSubsidiary=${
              coreConfig.getUser().ovhSubsidiary
            }`,
          )
          .then(({ data: catalog }) => preparePlans(catalog)),
      trackClickConfirmOrder: /* @ngInject */ (atInternet) => (hits) => {
        atInternet.trackClick({
          name: `nasha-confirm-creation::${hits}`,
          type: 'action',
        });
      },
    },
  });
};
