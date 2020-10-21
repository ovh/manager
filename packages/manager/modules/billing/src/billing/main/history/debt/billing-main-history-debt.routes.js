export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('billing.main.history.debt', {
    url: '/debt/:debtId',
    abstract: true,
  });
};
