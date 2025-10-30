import { DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS } from '../../../../../../components/dedicated-cloud/datacenter/zerto/dedicatedCloud-datacenter-zerto.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.datacenter.drp.ovh.secondPccStep',
    {
      url: '/secondPcc',
      params: {
        currentStep: 2,
        zertoInformations: {
          zertoType: DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.ovh,
        },
      },
      redirectTo:
        'app.managedBaremetal.details.datacenters.datacenter.zerto.ovh.secondPccStep',
    },
  );
};
