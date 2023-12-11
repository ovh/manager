export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-server.server.ftpBackup.order', {
    url: '/order',
    views: {
      modal: {
        component: 'dedicatedServerFtpBackupOrder',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToFtpBackUpStorage) => goToFtpBackUpStorage,
      breadcrumb: () => null,
    },
  });
};
