import { DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS } from '../../../../../../components/dedicated-cloud/datacenter/zerto/dedicatedCloud-datacenter-zerto.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.drp.onPremise.ovhPccStep',
    {
      url: '/ovhPcc',
      params: {
        currentStep: 1,
        drpInformations: {
          drpType: DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.onPremise,
        },
      },
      redirectTo:
        'app.dedicatedCloud.details.datacenter.details.zerto.onPremise.ovhPccStep',
    },
  );
};
