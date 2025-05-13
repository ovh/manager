export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicated-server.server.ftpBackup.passwordRequest',
    {
      url: '/passwordRequest',
      views: {
        modal: {
          component: 'dedicatedServerFtpBackupPasswordRequest',
        },
      },
      params: {
        requestData: null,
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ (goToFtpBackUpStorage) => goToFtpBackUpStorage,
        requestData: /* @ngInject */ ($transition$) =>
          $transition$.params().requestData,
        breadcrumb: () => null,
      },
    },
  );
};
