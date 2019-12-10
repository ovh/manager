import component from './dedicatedCloud-drpDatacenterSelection.component';

const moduleName = 'dedicatedCloudDrpDatacenterSelectionModule';

angular
  .module(moduleName, [])
  .component(component.name, component)
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider
      .state('app.dedicatedClouds.drpDatacenterSelection', {
        url: '/drpDatacenterSelection',
        views: {
          modal: {
            component: component.name,
          },
        },
        layout: 'modal',
        resolve: {
          goToDrpConfiguration: /* @ngInject */ (
            $state,
            currentDrp,
          ) => datacenterId => $state.go(
            'app.dedicatedClouds.datacenter.drp',
            { datacenterId, drpInformations: currentDrp },
          ),
        },
        translations: { value: ['.'], format: 'json' },
      });
  });

export default moduleName;
