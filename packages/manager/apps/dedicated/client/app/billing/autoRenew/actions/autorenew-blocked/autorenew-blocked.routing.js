export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew.blocked', {
    url: '/blocked',
    views: {
      modal: {
        component: 'billingAutorenewBlocked',
      },
    },
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
    resolve: {
      gotoContracts: /* @ngInject */ ($state, atInternet) => () => {
        atInternet.trackClick({
          name: 'autorenew::configure-renew-impossible',
          type: 'action',
          chapter1: 'go-to-agreements',
        });
        return $state.go('app.account.billing.autorenew.agreements');
      },
    },
  });
};
