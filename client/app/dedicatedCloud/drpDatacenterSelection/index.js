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
        translations: { value: ['.'], format: 'json' },
      });
  });

export default moduleName;
