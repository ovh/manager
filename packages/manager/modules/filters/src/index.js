import angular from 'angular';

import bandwidth from './bandwidth';
import durationIso8601 from './duration-iso8601';

const moduleName = 'ovhManagerFilters';

angular.module(moduleName, [bandwidth, durationIso8601]);

export default moduleName;
