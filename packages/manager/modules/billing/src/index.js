import angular from 'angular';

import servicesActions from './components/services-actions';
import { RENEW_URL } from './components/services-actions/service-actions.constants';

const moduleName = 'ovhManagerBilling';

angular.module(moduleName, [servicesActions]);

export { RENEW_URL };

export default moduleName;
