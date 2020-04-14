export default {
  url: '/confirm',
  views: {
    modal: {
      component: 'domainAnycastConfirmTerminate',
    },
  },
  layout: 'modal',
  resolve: {
    goBack: /* @ngInject */ ($state) => () => $state.go('^'),
  },
};
