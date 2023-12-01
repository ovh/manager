export default /* @ngInject */ ($stateProvider, coreConfigProvider) => {
  if (!coreConfigProvider.isRegion('US')) {
    $stateProvider.state('app.dedicated-cluster.cluster.node.ftpBackup', {
      url: '/backup',
      views: {
        'tabView@app.dedicated-cluster.cluster.node': {
          component: 'dedicatedClusterNodeFtpBackupStorage',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('dedicated_server_ftp_backup'),
        goToFtpBackUpStorage: ($state, Alerter) => (
          message = false,
          type = 'success',
        ) => {
          const promise = $state.go(
            'app.dedicated-cluster.cluster.node.ftpBackup',
          );
          if (message) {
            promise.then(() => Alerter[type](message));
          }
          return promise;
        },
      },
    });
  }
};
