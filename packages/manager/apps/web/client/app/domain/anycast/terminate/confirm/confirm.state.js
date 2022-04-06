const state = {
  url: '/confirm',
  views: {
    modal: {
      component: 'domainAnycastConfirmTerminate',
    },
  },
  layout: 'modal',
  resolve: {
    goBack: /* @ngInject */ ($state) => () => $state.go('^'),
    breadcrumb: /* @ngInject */ () => null,
  },
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.domain.product.terminate_anycast.confirm', {
    ...state,
  });
  $stateProvider.state('app.alldom.domain.terminate_anycast.confirm', {
    ...state,
  });
};
