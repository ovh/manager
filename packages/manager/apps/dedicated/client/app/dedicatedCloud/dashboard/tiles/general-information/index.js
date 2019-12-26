import component from './general-information.component';

const moduleName = 'ovhManagerPccDashboardGeneralInformation';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
