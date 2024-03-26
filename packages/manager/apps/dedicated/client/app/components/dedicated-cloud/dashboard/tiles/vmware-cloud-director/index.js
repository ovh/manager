import component from './component';

const moduleName = 'ovhManagerPccDashboardVmwareCloudDirector';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
