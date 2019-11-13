import component from './dedicatedCloud-datacenter-drp.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('app.dedicatedClouds.datacenter.drp', {
      url: '/drp',
      views: {
        'pccDatacenterView@app.dedicatedClouds.datacenter': component.name,
      },
      params: {
        selectedDrpType: null,
      },
      resolve: {
        datacenterHosts: /* @ngInject */ ($stateParams, DedicatedCloud) => DedicatedCloud
          .getHosts($stateParams.productId, $stateParams.datacenterId),
        datacenterList: /* @ngInject */ ($stateParams, DedicatedCloud) => DedicatedCloud
          .getDatacenters($stateParams.productId).then(({ results }) => results),
        disableForUS: /* @ngInject */ ($q, coreConfig) => (coreConfig.getRegion() === 'US' ? $q.reject() : $q.when()),
        goToConfiguration: /* @ngInject */ $state => (drpInformations, stateToGo) => $state.go(`app.dedicatedClouds.datacenter.drp.${stateToGo}`, { drpInformations }),
        goToSummary: /* @ngInject */ $state => drpInformations => $state.go('app.dedicatedClouds.datacenter.drp.summary', { drpInformations }),
        selectedDrpType: /* @ngInject */ $transition$ => ({
          id: _.get($transition$.params().selectedDrpType, 'id', null),
        }),
        storedDrpInformations: /* @ngInject */ (
          currentService,
          dedicatedCloudDrp,
        ) => dedicatedCloudDrp
          .checkForZertoOptionOrder(currentService.serviceName),
      },
    });
};
