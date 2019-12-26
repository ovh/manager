import angular from 'angular';
import '@uirouter/angularjs';

import addModule from './add.module';

const moduleName = 'nashaPartitionAdd';

angular.module(moduleName, ['ui.router', addModule]);

export default moduleName;
