import component from './update.component';

const moduleName = 'ovhManagerPccDashboardUpdateVersionModule';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component('ovhManagerPccDashboardUpdateVersion', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
