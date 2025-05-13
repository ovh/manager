export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('billing.main.history.details.debt', {
    url: '/debt/:debtId',
    abstract: true,
  });
};
