import { DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS } from '../../../../../../components/dedicated-cloud/datacenter/zerto/dedicatedCloud-datacenter-zerto.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.zerto.onPremise.onPremisePccStep',
    {
      url: '/onPremisePcc',
      views: {
        'innerView@app.dedicatedCloud.details.datacenter.details.zerto': {
          component: 'dedicatedCloudDatacenterZertoOnPremiseOnPremisePccStep',
        },
      },
      params: {
        currentStep: 2,
        zertoInformations: {
          zertoType: DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.onPremise,
        },
      },
      resolve: {
        zertoInformations: /* @ngInject */ ($transition$) =>
          $transition$.params().zertoInformations,
        goToPreviousStep: /* @ngInject */ ($state) => (zertoInformations) =>
          $state.go(
            'app.dedicatedCloud.details.datacenter.details.zerto.onPremise.ovhPccStep',
            {
              zertoInformations,
            },
          ),
      },
    },
  );
};
