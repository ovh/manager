export default {
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
