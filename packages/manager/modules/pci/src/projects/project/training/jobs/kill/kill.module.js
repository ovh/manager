import angular from 'angular';
import '@uirouter/angularjs';

import component from '../components/kill';
import routing from './kill.routing';

const moduleName = 'ovhManagerPciTrainingJobsKill';

angular.module(moduleName, ['ui.router', component]).config(routing);

export default moduleName;
