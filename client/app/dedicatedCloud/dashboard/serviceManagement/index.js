import component from './serviceManagement.component';

const moduleName = 'ovhManagerPccDashboardServiceManagement';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
