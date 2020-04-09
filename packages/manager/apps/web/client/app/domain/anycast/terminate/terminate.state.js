export default {
  url: '/anycast-terminate',
  views: {
    domainView: {
      component: 'domainAnycastTerminate',
    },
  },
  resolve: {
    previousState: /* @ngInject */ ($transition$) => $transition$.$from(),
    goBack: /* @ngInject */ ($state, previousState) => () => {
      if (previousState.name) {
        $state.go(previousState.name);
      } else {
        $state.go('app.domain.product.dns');
      }
    },
  },
};
