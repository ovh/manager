import { DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS } from '../../../../../../components/dedicated-cloud/datacenter/zerto/dedicatedCloud-datacenter-zerto.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state(
      'app.dedicatedCloud.details.datacenter.details.drp.ovh.mainPccStep',
      {
        url: '/mainPcc',
        params: {
          currentStep: 1,
          drpInformations: {
            drpType: DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.ovh,
          },
        },
        redirectTo:
          'app.dedicatedCloud.details.datacenter.details.zerto.ovh.mainPccStep',
      },
    )
    .state(
      'app.dedicatedCloud.details.datacenter.details.drp.ovh.mainPccStep.legacyOrderIp',
      {
        url: '/legacyOrderIp',
        redirectTo:
          'app.dedicatedCloud.details.datacenter.details.zerto.ovh.mainPccStep.legacyOrderIp',
      },
    )
    .state(
      'app.dedicatedCloud.details.datacenter.details.drp.ovh.mainPccStep.orderIp',
      {
        url: '/orderIp',
        redirectTo:
          'app.dedicatedCloud.details.datacenter.details.zerto.ovh.mainPccStep.orderIp',
      },
    );
};
