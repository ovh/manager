import { SOFTPHONE_TRACKING } from '../softphone.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.softphone.delete',
    {
      url: '/delete?deviceId',
      views: {
        modal: {
          component: 'softphoneDeleteDevice',
        },
      },
      layout: 'modal',
      params: {
        deviceId: null,
      },
      resolve: {
        deviceId: /* @ngInject */ ($transition$) =>
          $transition$.params().deviceId,
        goBack: /* @ngInject */ ($state, trackPage, deviceId) => (reload) => {
          if (reload) {
            trackPage({
              ...SOFTPHONE_TRACKING.DEVICE_MANAGEMENT.DATAGRID,
              name: SOFTPHONE_TRACKING.DEVICE_MANAGEMENT.DATAGRID.name.replace(
                /{{deviceAction}}/g,
                deviceId ? 'device-addition' : 'all-device-deletion',
              ),
            });
          }
          return $state.go('^', {}, { reload });
        },
      },
      atInternet: {
        ignore: true,
      },
      onEnter: /* @ngInject */ (trackPage) => {
        trackPage(SOFTPHONE_TRACKING.REMOVE_DEVICE.PAGE);
      },
    },
  );
};
