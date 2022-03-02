import angular from 'angular';

import bandwidth from './bandwidth';
import durationIso8601 from './duration-iso8601';
import bytes from './bytes';

const moduleName = 'ovhManagerFilters';

angular.module(moduleName, [bandwidth, bytes, durationIso8601]);

export default moduleName;
