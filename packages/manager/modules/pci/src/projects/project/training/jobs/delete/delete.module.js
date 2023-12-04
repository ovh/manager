import angular from 'angular';
import '@uirouter/angularjs';

import component from './delete.component';
import routing from './delete.routing';

const moduleName = 'ovhManagerPciTrainingJobsDelete';

angular.module(moduleName, ['ui.router', component]).config(routing);

export default moduleName;
