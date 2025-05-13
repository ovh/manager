export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.service.dashboard.creditTransfer', {
    url: '/creditTransfer',
    views: {
      modal: {
        component: 'smsCreditTransferComponent',
      },
    },
    layout: 'modal',
    resolve: {
      goToDashboard: /* @ngInject */ ($state, TucToast) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';
        const promise = $state.go(
          'sms.service.dashboard',
          {},
          {
            reload,
          },
        );
        if (message) {
          promise.then(() => {
            if (type === 'success') {
              TucToast.success(message);
            } else {
              TucToast.error(message);
            }
          });
        }
        return promise;
      },
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('sms_creditTransfer_title'),
    },
    atInternet: {
      ignore: true,
    },
  });
};
