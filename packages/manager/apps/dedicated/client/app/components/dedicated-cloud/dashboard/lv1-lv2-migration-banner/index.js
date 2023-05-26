import component from './lv1-lv2-migration-banner.component';

const moduleName = 'ovhManagerPccDashboardLv1Lv2MigrationBanner';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
