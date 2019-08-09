import component from './dedicatedCloud-datacenter-drp-ovh-secondPccStep.component';

const componentName = 'dedicatedCloudDatacenterDrpOvhSecondPccStep';
const moduleName = 'dedicatedCloudDatacenterDrpOvhSecondPccStep';

angular
  .module(moduleName, [])
  .component(componentName, component)
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider
      .state('app.dedicatedClouds.datacenter.drp.ovh.secondPccStep', {
        views: {
          'stepView@app.dedicatedClouds.datacenter.drp': {
            component: 'dedicatedCloudDatacenterDrpOvhSecondPccStep',
          },
        },
        params: {
          currentStep: 2,
          drpInformations: { },
        },
      })
      .state('app.dedicatedClouds.datacenter.drp.ovh.secondPccStep.orderIp', {
        controller: 'agoraIpOrderCtrl',
        templateUrl: 'ip/ip/agoraOrder/ip-ip-agoraOrder.html',
        layout: 'modal',
        translations: { value: ['.'], format: 'json' },
      })
      .state('app.dedicatedClouds.datacenter.drp.ovh.secondPccStep.legacyOrderIp', {
        controller: 'IpLegacyOrderCtrl',
        templateUrl: 'ip/ip/legacyOrder/ip-ip-legacyOrder.html',
        layout: 'modal',
        translations: { value: ['.'], format: 'json' },
      });
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
