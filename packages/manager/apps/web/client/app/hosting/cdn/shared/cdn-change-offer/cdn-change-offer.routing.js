import { HOSTING_CDN_ORDER_CATALOG_ADDONS_PLAN_CODE_CDN_ADVANCED } from '../../order/hosting-cdn-order.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.cdn.shared.cdn-change-offer', {
    url: '/cdn-change-offer',
    layout: 'modal',
    views: {
      modal: {
        component: 'cdnChangeOfferComponent',
      },
    },
    params: {
      model: null,
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('model')
        .then((model) => {
          return !model ? { state: 'app.hosting.dashboard.cdn.shared' } : false;
        }),
    resolve: {
      model: /* @ngInject */ ($transition$) => $transition$.params().model,

      goBack: /* @ngInject */ ($state) => () => $state.go('^'),

      goToCdnChangeOffer: /* @ngInject */ ($state) => () =>
        $state.go('app.hosting.dashboard.cdn.upgrade', {
          planToPreselect: HOSTING_CDN_ORDER_CATALOG_ADDONS_PLAN_CODE_CDN_ADVANCED,
        }),
    },
  });
};
