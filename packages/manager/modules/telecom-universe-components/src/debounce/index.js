import angular from 'angular';

import tucDebounce from './debounce.factory';

const moduleName = 'tucDebounce';

angular.module(moduleName, []).factory('tucDebounce', tucDebounce);

export default moduleName;
