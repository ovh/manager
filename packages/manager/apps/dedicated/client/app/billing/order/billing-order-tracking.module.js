import orderTracking from '@ovh-ux/order-tracking';
import routing from './billing-order-tracking.routing';

const moduleName = 'ovhManagerBillingOrder';

angular.module(moduleName, [
  'ui.router',
  orderTracking,
]).config(routing);

export default moduleName;
