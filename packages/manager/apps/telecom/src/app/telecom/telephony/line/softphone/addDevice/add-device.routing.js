import { SOFTPHONE_TRACKING } from '../softphone.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.softphone.add',
    {
      url: '/add',
      views: {
        modal: {
          component: 'softphoneAddDevice',
        },
      },
      layout: 'modal',
      resolve: {
        deviceId: /* @ngInject */ ($transition$) =>
          $transition$.params().deviceId,
        angularQr: /* @ngInject */ ($ocLazyLoad) =>
          import('angular-qr').then((module) =>
            $ocLazyLoad.inject(module.default || module),
          ),
        goBack: /* @ngInject */ ($state) => (reload) =>
          $state.go('^', {}, { reload }),
      },
      atInternet: {
        ignore: true,
      },
      onEnter: /* @ngInject */ (trackPage) => {
        trackPage(SOFTPHONE_TRACKING.ADD_DEVICE.PAGE);
      },
    },
  );
};
