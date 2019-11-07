export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.sql-database.order', {
    url: '/order?orderType&currentHosting',
    params: {
      currentHosting: { value: null, squash: true },
      orderType: { value: 'private' },
    },
    component: 'hostingSqlDatabaseOrder',
    resolve: {
      goBack: /* @ngInject */ goToHosting => goToHosting,
    },
  });
};
