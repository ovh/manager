export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.main.history.debt', {
    url: '/debt/:debtId',
    abstract: true,
  });
};
