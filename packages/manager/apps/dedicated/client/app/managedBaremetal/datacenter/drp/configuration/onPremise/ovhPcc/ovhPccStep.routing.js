import { DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS } from '../../../../../../components/dedicated-cloud/datacenter/drp/dedicatedCloud-datacenter-drp.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.datacenter.drp.onPremise.ovhPccStep',
    {
      url: '/ovhPcc',
      views: {
        'innerView@app.managedBaremetal.details.datacenters.datacenter.drp': {
          component: 'ovhManagerDedicatedCloudDatacenterDrpMainPcc',
        },
      },
      params: {
        currentStep: 1,
        drpInformations: {
          drpType: DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.onPremise,
        },
      },
      resolve: {
        datacenterId: /* @ngInject */ ($transition$) =>
          $transition$.params().datacenterId,
        defaultLocalVraNetwork: /* @ngInject */ (
          $transition$,
          currentService,
          dedicatedCloudDrp,
          drpInformations,
        ) =>
          drpInformations.localVraNetwork === undefined
            ? dedicatedCloudDrp.getDefaultLocalVraNetwork({
                datacenterId: $transition$.params().datacenterId,
                serviceName: currentService.serviceName,
              })
            : null,
        drpInformations: /* @ngInject */ ($transition$) =>
          $transition$.params().drpInformations,
        goBackToChoice: /* @ngInject */ ($state) => (selectedDrpType) =>
          $state.go('app.managedBaremetal.details.datacenters.datacenter.drp', {
            selectedDrpType,
          }),
        goToNextStep: /* @ngInject */ ($state) => (drpInformations) =>
          $state.go(
            'app.managedBaremetal.details.datacenters.datacenter.drp.onPremise.onPremisePccStep',
            { drpInformations },
          ),
        ipAddressDetails: /* @ngInject */ (currentService, dedicatedCloudDrp) =>
          dedicatedCloudDrp.getPccIpAddressesDetails(
            currentService.serviceName,
          ),
        breadcrumb: () => null,
      },
    },
  );
};
