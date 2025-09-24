import angular from 'angular';

import advancedPolicySearch from '../../../components/advancedPolicySearch';
import routing from './advanced-search.routing';

const moduleName = 'ovhManagerIAMAdvancedPolicySearch';

angular.module(moduleName, [advancedPolicySearch]).config(routing);

export default moduleName;
