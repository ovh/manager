export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicated-cluster.cluster.node.ftpBackup.updateAccess',
    {
      url: '/updateAccess',
      views: {
        modal: {
          component: 'dedicatedServerFtpBackupAccessUpdate',
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
