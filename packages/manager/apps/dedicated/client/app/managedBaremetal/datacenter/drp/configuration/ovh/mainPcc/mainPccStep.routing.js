import { DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS } from '../../../../../../components/dedicated-cloud/datacenter/zerto/dedicatedCloud-datacenter-zerto.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state(
      'app.managedBaremetal.details.datacenters.datacenter.drp.ovh.mainPccStep',
      {
        url: '/mainPcc',
        redirectTo:
          'app.managedBaremetal.details.datacenters.datacenter.zerto.mainPccStep',
        params: {
          currentStep: 1,
          zertoInformations: {
            zertoType: DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.ovh,
          },
        },
      },
    )
    .state(
      'app.managedBaremetal.details.datacenters.datacenter.drp.ovh.mainPccStep.legacyOrderIp',
      {
        url: '/legacyOrderIp',
        redirectTo:
          'app.managedBaremetal.details.datacenters.datacenter.zerto.mainPccStep.legacyOrderIp',
      },
    )
    .state(
      'app.managedBaremetal.details.datacenters.datacenter.drp.ovh.mainPccStep.orderIp',
      {
        url: '/orderIp',
        redirectTo:
          'app.managedBaremetal.details.datacenters.datacenter.zerto.mainPccStep.orderIp',
      },
    );
};
