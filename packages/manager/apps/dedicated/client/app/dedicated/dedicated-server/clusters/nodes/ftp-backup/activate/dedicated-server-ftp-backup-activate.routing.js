export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicated-cluster.cluster.node.ftpBackup.activate',
    {
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
    },
  );
};
