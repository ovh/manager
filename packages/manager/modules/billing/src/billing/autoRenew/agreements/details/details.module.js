import routing from './details.routing';
import controller from './user-agreements-details.controller';

const moduleName = 'ovhManagerBillingAgreementsDetails';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .controller('UserAccountAgreementsDetailsController', controller);

export default moduleName;
