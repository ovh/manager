angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.account.billing.main.history.details.debt', {
    url: '/debt/:debtId',
    abstract: true,
  });
});
