export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.service.senders.orderTime2Chat', {
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
          'sms.service.senders',
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
        $translate.instant('sms_order_time2chat_title'),
    },
    atInternet: {
      ignore: true,
    },
  });
};
