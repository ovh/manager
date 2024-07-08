export default /* @ngInject */ ($stateProvider, coreConfigProvider) => {
  if (!coreConfigProvider.isRegion('US')) {
    $stateProvider.state('app.dedicated-server.server.ftpBackup', {
      url: '/backup',
      views: {
        'tabView@app.dedicated-server.server': {
          component: 'dedicatedServerFtpBackupStorage',
        },
      },
      redirectTo: (transition) => {
        const injector = transition.injector();
        const backupIsOrderablePromise = injector.getAsync('backupIsOrderable');
        const serverNamePromise = injector.getAsync('serverName');

        return Promise.all([backupIsOrderablePromise, serverNamePromise]).then(
          ([backupIsOrderable, serverName]) =>
            backupIsOrderable
              ? null
              : {
                  state: 'app.dedicated-server.server.dashboard',
                  params: { productId: serverName },
                },
        );
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
