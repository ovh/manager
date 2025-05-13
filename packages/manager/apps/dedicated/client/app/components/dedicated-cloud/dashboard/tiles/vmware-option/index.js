import component from './vmware-option.component';

const moduleName = 'ovhManagerPccDashboardVmwareOption';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
