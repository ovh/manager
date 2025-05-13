export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicated-cluster.cluster.node.ftpBackup.deleteAccess',
    {
      url: '/deleteAccess',
      views: {
        modal: {
          component: 'dedicatedServerFtpBackupAccessDelete',
        },
      },
      params: {
        ipbackup: null,
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ (goToFtpBackUpStorage) => goToFtpBackUpStorage,
        ipbackup: /* @ngInject */ ($transition$) =>
          $transition$.params().ipbackup,
        breadcrumb: () => null,
      },
    },
  );
};
