import component from './basic-option.component';

const moduleName = 'ovhManagerPccDashboardOptionsDescriptionsBasicOption';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
