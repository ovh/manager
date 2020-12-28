import component from './security-options.component';

const moduleName = 'ovhManagerPccDashboardSecurityOptions';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
