const state = {
  url: '/dns-anycast',
  views: {
    domainView: {
      component: 'domainAnycast',
    },
  },
  resolve: {
    previousState: /* @ngInject */ ($transition$) => $transition$.$from(),
    goBack: /* @ngInject */ ($state, previousState) => () => {
      if (previousState.name) {
        $state.go(previousState.name);
      } else {
        $state.go('^');
      }
    },
  },
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.domain.product.anycast', { ...state });
  $stateProvider.state('app.alldom.domain.anycast', { ...state });
};
