export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.service.options.smppParameter', {
    url: '/smppParameter',
    views: {
      'smsView@sms.service': {
        component: 'ovhManagerSmsOptionsSmppParameter',
      },
    },
    resolve: {
      goToOptions: /* @ngInject */ ($state, TucToast) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';
        const promise = $state.go(
          'sms.service.options',
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
        $translate.instant('sms_options_smpp_parameter_title'),
    },
  });
};
