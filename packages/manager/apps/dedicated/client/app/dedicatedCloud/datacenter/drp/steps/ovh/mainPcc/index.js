import component from './dedicatedCloud-datacenter-drp-ovh-mainPccStep.component';

const componentName = 'dedicatedCloudDatacenterDrpOvhMainPccStep';
const moduleName = 'dedicatedCloudDatacenterDrpOvhMainPccStep';

angular
  .module(moduleName, [])
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider
      .state('app.dedicatedClouds.datacenter.drp.ovh.mainPccStep', {
        views: {
          'stepView@app.dedicatedClouds.datacenter.drp': {
            component: 'dedicatedCloudDatacenterDrpOvhMainPccStep',
          },
        },
        params: {
          currentStep: 1,
          drpInformations: { },
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
  })
  .component(componentName, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
