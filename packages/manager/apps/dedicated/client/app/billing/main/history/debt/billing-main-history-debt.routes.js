export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.main.history.details.debt', {
    url: '/debt/:debtId',
    abstract: true,
  });
};
