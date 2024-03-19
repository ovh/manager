export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-cluster.cluster.node.ftpBackup.delete', {
    url: '/delete',
    views: {
      modal: {
        component: 'dedicatedServerFtpBackupDelete',
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
  });
};
