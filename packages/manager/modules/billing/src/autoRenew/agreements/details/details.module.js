import uiRouter from '@uirouter/angularjs';
import routing from './details.routing';
import component from './user-agreements-details.component';

const moduleName = 'ovhManagerBillingAgreementsDetails';

angular
  .module(moduleName, [uiRouter])
  .config(routing)
  .component('userAgreementsDetails', component);

export default moduleName;
