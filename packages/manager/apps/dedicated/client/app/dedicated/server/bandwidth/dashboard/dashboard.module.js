import component from './dashboard.component';

const moduleName = 'ovhManagerDedicatedServerBandwidthDashboard';

angular
  .module(moduleName, ['ui.router'])
  .component('dedicatedServerBandwidthDashboard', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
