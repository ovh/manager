export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-server.server.ftpBackup.activate', {
    url: '/activate',
    views: {
      modal: {
        component: 'dedicatedServerFtpBackupActivate',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToFtpBackUpStorage) => goToFtpBackUpStorage,
      breadcrumb: () => null,
    },
  });
};
