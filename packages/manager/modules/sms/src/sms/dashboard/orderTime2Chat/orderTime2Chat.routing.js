export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.service.dashboard.orderTime2Chat', {
    url: '/orderTime2Chat',
    views: {
      modal: {
        component: 'smsOrderTime2ChatComponent',
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
        $translate.instant('sms_orderTime2Chat_title'),
    },
    atInternet: {
      ignore: true,
    },
  });
};
