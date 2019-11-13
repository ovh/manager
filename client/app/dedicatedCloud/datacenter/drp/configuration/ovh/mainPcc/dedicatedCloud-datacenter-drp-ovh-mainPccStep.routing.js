export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('app.dedicatedClouds.datacenter.drp.ovh.mainPccStep', {
      url: '/mainPcc',
      views: {
        'innerView@app.dedicatedClouds.datacenter.drp': {
          component: 'dedicatedCloudDatacenterDrpOvhMainPccStep',
        },
      },
      params: {
        currentStep: 1,
        drpInformations: { },
      },
      resolve: {
        datacenterId: /* @ngInject */ $transition$ => $transition$.params()
          .datacenterId,
        drpInformations: /* @ngInject */ $transition$ => $transition$.params()
          .drpInformations,
        goBackToChoice: /* @ngInject */ $state => selectedDrpType => $state.go('app.dedicatedClouds.datacenter.drp', { selectedDrpType }),
        goToNextStep: /* @ngInject */ $state => drpInformations => $state.go('app.dedicatedClouds.datacenter.drp.ovh.secondPccStep', { drpInformations }),
        ipAddressDetails: /* @ngInject */ (
          currentService,
          dedicatedCloudDrp,
        ) => dedicatedCloudDrp
          .getPccIpAddressesDetails(currentService.serviceName),
      },
    })
    .state('app.dedicatedClouds.datacenter.drp.ovh.mainPccStep.legacyOrderIp', {
      controller: 'IpLegacyOrderCtrl',
      templateUrl: 'ip/ip/legacyOrder/ip-ip-legacyOrder.html',
      layout: 'modal',
      translations: { value: ['.'], format: 'json' },
    })
    .state('app.dedicatedClouds.datacenter.drp.ovh.mainPccStep.orderIp', {
      controller: 'agoraIpOrderCtrl',
      templateUrl: 'ip/ip/agoraOrder/ip-ip-agoraOrder.html',
      layout: 'modal',
      translations: { value: ['.'], format: 'json' },
    });
};
