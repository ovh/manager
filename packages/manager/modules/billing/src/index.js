import angular from 'angular';

import commitment from './components/commitment';
import cancelCommitment from './components/cancel-commitment';
import cancelResiliation from './components/cancel-resiliation';
import resiliation from './components/resiliation';
import servicesActions from './components/services-actions';
import serviceStatus from './components/service-status';
import subscriptionTile from './components/subscription-tile';
import { RENEW_URL } from './components/services-actions/service-actions.constants';

const moduleName = 'ovhManagerBilling';

angular.module(moduleName, [
  commitment,
  cancelCommitment,
  cancelResiliation,
  resiliation,
  servicesActions,
  serviceStatus,
  subscriptionTile,
]);

export { RENEW_URL };

export default moduleName;
