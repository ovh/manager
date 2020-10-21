import angular from 'angular';

import servicesActions from './components/services-actions';
import { RENEW_URL } from './components/services-actions/service-actions.constants';
import billingManagement from './billing';

const moduleName = 'ovhManagerBillingAll';

angular.module(moduleName, [servicesActions]);

export { RENEW_URL, billingManagement };

export default moduleName;
