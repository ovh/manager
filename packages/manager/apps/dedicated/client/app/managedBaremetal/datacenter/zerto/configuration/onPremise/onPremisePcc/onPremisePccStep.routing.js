import { DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS } from '../../../../../../components/dedicated-cloud/datacenter/zerto/dedicatedCloud-datacenter-zerto.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.datacenter.zerto.onPremise.onPremisePccStep',
    {
      url: '/onPremisePcc',
      views: {
        'innerView@app.managedBaremetal.details.datacenters.datacenter.zerto': {
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
            'app.managedBaremetal.details.datacenters.datacenter.zerto.onPremise.ovhPccStep',
            {
              zertoInformations,
            },
          ),
        breadcrumb: () => null,
      },
    },
  );
};
