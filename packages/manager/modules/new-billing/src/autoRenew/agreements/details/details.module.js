import uiRouter from '@uirouter/angularjs';
import routing from './details.routing';

const moduleName = 'ovhManagerBillingAgreementsDetails';

angular.module(moduleName, [uiRouter]).config(routing);

export default moduleName;
