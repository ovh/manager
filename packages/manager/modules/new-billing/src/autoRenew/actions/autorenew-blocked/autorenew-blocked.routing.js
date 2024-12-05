export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('billing.autorenew.configure-renew-impossible', {
    url: '/configure-renew-impossible',
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
          name:
            'dedicated::account::billing::autorenew::configure-renew-impossible::go-to-agreements',
          type: 'action',
        });
        return $state.go('billing.autorenew.agreements');
      },
      breadcrumb: () => null,
    },
  });
};
