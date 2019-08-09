import component from './legacy.component';

const moduleName = 'ovhManagerPccDashboardLegacy';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component(component.name, component);

export default moduleName;
