export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('app.dedicatedClouds.datacenter.drp.onPremise.ovhPccStep', {
      url: '/ovhPcc',
      views: {
        'innerView@app.dedicatedClouds.datacenter.drp': {
          component: 'dedicatedCloudDatacenterDrpOnPremiseOvhPccStep',
        },
      },
      params: {
        currentStep: 1,
        drpInformations: { },
      },
      resolve: {
        datacenterId: /* @ngInject */ $transition$ => $transition$.params()
          .datacenterId,
        defaultLocalVraNetwork: /* @ngInject */ (
          $q,
          $transition$,
          currentService,
          dedicatedCloudDrp,
        ) => dedicatedCloudDrp.getDefaultLocalVraNetwork({
          datacenterId: $transition$.params().datacenterId,
          serviceName: currentService.serviceName,
        }),
        drpInformations: /* @ngInject */ $transition$ => $transition$.params()
          .drpInformations,
        goBackToChoice: /* @ngInject */ $state => selectedDrpType => $state.go('app.dedicatedClouds.datacenter.drp', { selectedDrpType }),
        goToNextStep: /* @ngInject */ $state => drpInformations => $state.go('app.dedicatedClouds.datacenter.drp.onPremise.onPremisePccStep', { drpInformations }),
        ipAddressDetails: /* @ngInject */ (
          currentService,
          dedicatedCloudDrp,
        ) => dedicatedCloudDrp
          .getPccIpAddressesDetails(currentService.serviceName),
      },
    });
};
