import { DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS } from '../../../../../../components/dedicated-cloud/datacenter/zerto/dedicatedCloud-datacenter-zerto.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.datacenter.drp.onPremise.ovhPccStep',
    {
      url: '/ovhPcc',
      params: {
        currentStep: 1,
        zertoInformations: {
          zertoType: DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.onPremise,
        },
      },
      redirectTo:
        'app.managedBaremetal.details.datacenters.datacenter.zerto.onPremise.ovhPccStep',
    },
  );
};
