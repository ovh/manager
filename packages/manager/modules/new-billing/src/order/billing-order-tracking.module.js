import ngOvhOrderTracking from '@ovh-ux/ng-ovh-order-tracking';
import uiRouter from '@uirouter/angularjs';
import routing from './billing-order-tracking.routing';

const moduleName = 'ovhManagerBillingOrder';

angular.module(moduleName, [ngOvhOrderTracking, uiRouter]).config(routing);

export default moduleName;
