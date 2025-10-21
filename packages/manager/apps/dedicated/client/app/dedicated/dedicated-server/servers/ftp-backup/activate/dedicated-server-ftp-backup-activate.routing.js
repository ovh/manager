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
      serverRegion: /* @ngInject */ (server) => {
        const zone = server.region.split('-')[0];
        return ['eu', 'labeu'].includes(zone) ? 'Roubaix' : 'BHS';
      },
      goBack: /* @ngInject */ (goToFtpBackUpStorage) => goToFtpBackUpStorage,
      breadcrumb: () => null,
    },
  });
};
