import { SETTING_BASE_TRACKING_HIT } from '../hosting-cdn-shared-settings.constants';

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
        $state.go('app.hosting.dashboard.cdn.upgrade'),
    },
    atInternet: {
      rename: `${SETTING_BASE_TRACKING_HIT}::cdn-change-offer`,
    },
  });
};
