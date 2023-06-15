import { DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS } from '../../../../../../components/dedicated-cloud/datacenter/drp/dedicatedCloud-datacenter-drp.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.datacenter.drp.onPremise.onPremisePccStep',
    {
      url: '/onPremisePcc',
      views: {
        'innerView@app.managedBaremetal.details.datacenters.datacenter.drp': {
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
            'app.managedBaremetal.details.datacenters.datacenter.drp.onPremise.ovhPccStep',
            {
              drpInformations,
            },
          ),
        breadcrumb: () => null,
      },
    },
  );
};
