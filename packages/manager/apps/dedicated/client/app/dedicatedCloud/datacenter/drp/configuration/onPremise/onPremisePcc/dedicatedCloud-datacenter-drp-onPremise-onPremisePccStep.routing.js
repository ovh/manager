import { DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS } from '../../../../../../components/dedicated-cloud/datacenter/zerto/dedicatedCloud-datacenter-zerto.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.drp.onPremise.onPremisePccStep',
    {
      url: '/onPremisePcc',
      params: {
        currentStep: 2,
        drpInformations: {
          drpType: DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.onPremise,
        },
      },

      redirectTo:
        'app.dedicatedCloud.details.datacenter.details.zerto.onPremise.onPremisePccStep',
    },
  );
};
