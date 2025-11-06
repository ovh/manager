import { DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS } from '../../../../../../components/dedicated-cloud/datacenter/zerto/dedicatedCloud-datacenter-zerto.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.datacenter.zerto.onPremise.ovhPccStep',
    {
      url: '/ovhPcc',
      views: {
        'innerView@app.managedBaremetal.details.datacenters.datacenter.zerto': {
          component: 'ovhManagerDedicatedCloudDatacenterZertoMainPcc',
        },
      },
      params: {
        currentStep: 1,
        zertoInformations: {
          zertoType: DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.onPremise,
        },
      },
      resolve: {
        datacenterId: /* @ngInject */ ($transition$) =>
          $transition$.params().datacenterId,
        defaultLocalVraNetwork: /* @ngInject */ (
          $transition$,
          currentService,
          dedicatedCloudZerto,
          zertoInformations,
        ) =>
          zertoInformations.localVraNetwork === undefined
            ? dedicatedCloudZerto.getDefaultLocalVraNetwork({
                datacenterId: $transition$.params().datacenterId,
                serviceName: currentService.serviceName,
              })
            : null,
        zertoInformations: /* @ngInject */ ($transition$) =>
          $transition$.params().zertoInformations,
        goBackToChoice: /* @ngInject */ ($state) => (selectedZertoType) =>
          $state.go(
            'app.managedBaremetal.details.datacenters.datacenter.zerto',
            {
              selectedZertoType,
            },
          ),
        goToNextStep: /* @ngInject */ ($state) => (zertoInformations) =>
          $state.go(
            'app.managedBaremetal.details.datacenters.datacenter.zerto.onPremise.onPremisePccStep',
            { zertoInformations },
          ),
        ipAddressDetails: /* @ngInject */ (
          currentService,
          dedicatedCloudZerto,
        ) =>
          dedicatedCloudZerto.getPccIpAddressesDetails(
            currentService.serviceName,
          ),
        breadcrumb: () => null,
      },
    },
  );
};
