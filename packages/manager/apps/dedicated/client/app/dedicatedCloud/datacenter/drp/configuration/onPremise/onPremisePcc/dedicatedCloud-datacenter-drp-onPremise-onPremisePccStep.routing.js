import { DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS } from '../../../../../../components/dedicated-cloud/datacenter/drp/dedicatedCloud-datacenter-drp.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.drp.onPremise.onPremisePccStep',
    {
      url: '/onPremisePcc',
      views: {
        'innerView@app.dedicatedCloud.details.datacenter.details.drp': {
          component: 'dedicatedCloudDatacenterDrpOnPremiseOnPremisePccStep',
        },
      },
      params: {
        currentStep: 2,
        drpInformations: {
          drpType: DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.onPremise,
        },
      },
      resolve: {
        drpInformations: /* @ngInject */ ($transition$) =>
          $transition$.params().drpInformations,
        goToPreviousStep: /* @ngInject */ ($state) => (drpInformations) =>
          $state.go(
            'app.dedicatedCloud.details.datacenter.details.drp.onPremise.ovhPccStep',
            {
              drpInformations,
            },
          ),
      },
    },
  );
};
