import component from './public-order.component';
import routing from './public-order.routing';

const moduleName = 'ovhManagerDedicatedServerBandwidthPublicOrder';

angular
  .module(moduleName, ['ui.router'])
  .component('dedicatedServerBandwidthPublicOrder', component)
  .config(routing);

export default moduleName;
