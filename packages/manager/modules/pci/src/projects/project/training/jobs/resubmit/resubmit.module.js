import angular from 'angular';
import '@uirouter/angularjs';

import component from '../components/resubmit';
import routing from './resubmit.routing';

const moduleName = 'ovhManagerPciTrainingJobsResubmit';

angular.module(moduleName, ['ui.router', component]).config(routing);

export default moduleName;
