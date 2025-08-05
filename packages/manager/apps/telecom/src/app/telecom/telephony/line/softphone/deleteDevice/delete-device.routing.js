import { SOFTPHONE_TRACKING } from '../softphone.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.softphone.delete',
    {
      url: '/delete',
      views: {
        modal: {
          component: 'softphoneDeleteDevice',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ ($state, trackPage) => (reload) => {
          if (reload) {
            trackPage({
              ...SOFTPHONE_TRACKING.DEVICE_MANAGEMENT.DATAGRID,
              name: SOFTPHONE_TRACKING.DEVICE_MANAGEMENT.DATAGRID.name.replace(
                /{{deviceAction}}/g,
                'all-device-deletion',
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
