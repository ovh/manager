import ngOvhOrderTracking from '@ovh-ux/ng-ovh-order-tracking';
import routing from './billing-order-tracking.routing';

const moduleName = 'ovhManagerBillingOrder';

angular.module(moduleName, ['ui.router', ngOvhOrderTracking]).config(routing);

export default moduleName;
