export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicated-cluster.cluster.node.ftpBackup.addAccess',
    {
      url: '/addAccess',
      views: {
        modal: {
          component: 'dedicatedServerFtpBackupAccessAdd',
        },
      },
      params: {
        results: [],
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ (goToFtpBackUpStorage) => goToFtpBackUpStorage,
        results: /* @ngInject */ ($transition$) =>
          $transition$.params().results,
        breadcrumb: () => null,
      },
    },
  );
};
