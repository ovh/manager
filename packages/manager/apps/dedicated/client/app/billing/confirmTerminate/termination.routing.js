export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.confirmTerminate', {
    url: '/confirmTerminate?id&token',
    component: 'billingConfirmTermination',
    translations: { value: ['..'], format: 'json' },
  });
};
