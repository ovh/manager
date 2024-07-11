import component from './component';

const moduleName = 'ovhManagerPccDashboardManagedVcdMigrationBanner';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
