import component from './private-order.component';
import routing from './private-order.routing';

const moduleName = 'ovhManagerDedicatedServerBandwidthPrivateOrder';

angular
  .module(moduleName, [
    'ui.router',
  ])
  .component('dedicatedServerBandwidthPrivateOrder', component)
  .config(routing);

export default moduleName;
