export default /* @ngInject */ ($stateProvider, coreConfigProvider) => {
  if (!coreConfigProvider.isRegion('US')) {
    $stateProvider.state('app.dedicated-server.server.ftpBackup', {
      url: '/backup',
      views: {
        'tabView@app.dedicated-server.server': {
          component: 'dedicatedServerFtpBackupStorage',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('dedicated_server_ftp_backup'),
        goToFtpBackUpStorage: ($state, Alerter) => (
          message = false,
          type = 'success',
        ) => {
          const promise = $state.go('app.dedicated-server.server.ftpBackup');
          if (message) {
            promise.then(() => Alerter[type](message));
          }
          return promise;
        },
      },
    });
  }
};
