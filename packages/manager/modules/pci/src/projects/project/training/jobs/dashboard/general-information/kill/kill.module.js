import angular from 'angular';
import '@uirouter/angularjs';

import killComponent from '../../../components/kill';
import routing from './kill.routing';

const moduleName = 'ovhManagerPciTrainingJobsDashboardKill';

angular.module(moduleName, ['ui.router', killComponent]).config(routing);

export default moduleName;
