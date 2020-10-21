import template from './billing.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('billing', {
    url: '/billing',
    abstract: true,
    translations: { value: ['.'], format: 'json' },
    template,
    controller: 'BillingCtrl',
    resolve: {
      // currentUser: /* @ngInject */ (OvhApiMe) => OvhApiMe.v6().get().$promise,
      currentUser: /* @ngInject */ (User) => User.getUser(),
      denyEnterprise: ($q, $state, currentUser) => {
        if (
          currentUser.isEnterprise &&
          $state.transition.to().name !== 'app.account.billing.autorenew.ssh'
        ) {
          return $q.reject({
            status: 403,
            message: 'Access forbidden for enterprise accounts',
            code: 'FORBIDDEN_BILLING_ACCESS',
          });
        }

        return false;
      },
      goToOrders: /* @ngInject */ ($state) => () =>
        $state.go('app.account.billing.orders'),
    },
  });
};
