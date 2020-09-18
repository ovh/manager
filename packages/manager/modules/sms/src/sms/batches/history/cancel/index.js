import angular from 'angular';
import '@uirouter/angularjs';

import routing from './routing';

const moduleName = 'ovhManagerSmsBatchesHistoryCancel';

angular.module(moduleName, []).config(routing);

export default moduleName;
