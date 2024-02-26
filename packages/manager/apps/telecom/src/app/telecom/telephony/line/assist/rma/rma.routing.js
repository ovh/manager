import { PREFIX_TRACKING } from './rma.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.assist.rma',
    {
      url: '/rma',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          component: 'lineAssistRmaComponent',
        },
      },
      resolve: {
        billingAccount: /* @ngInject */ ($transition$) =>
          $transition$.params().billingAccount,
        serviceName: /* @ngInject */ ($transition$) =>
          $transition$.params().serviceName,
        reloadPage: /* @ngInject */ (
          $state,
          billingAccount,
          serviceName,
          TucToast,
        ) => (message = false, type = 'success') => {
          const reload = message && type === 'success';

          const promise = $state.go(
            'telecom.telephony.billingAccount.line.dashboard.assist.rma',
            {
              billingAccount,
              serviceName,
            },
            {
              reload,
            },
          );

          if (message) {
            promise.then(() => {
              TucToast[type](message);
            });
          }

          return promise;
        },
        rmaTrackClick: /* @ngInject */ (atInternet) => (
          hit,
          type = 'action',
        ) => {
          atInternet.trackClick({
            name: `${PREFIX_TRACKING}${hit}`,
            type,
          });
        },
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_line_assist_rma_title'),
      },
      atInternet: {
        rename: `${PREFIX_TRACKING}RMA`,
      },
    },
  );
};
