export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-server.server.ftpBackup.delete', {
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
