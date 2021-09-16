import angular from 'angular';
import '@uirouter/angularjs';

import deleteDatabase from '../components/delete-notebook';
import routing from './delete-notebook.routing';

const moduleName = 'ovhManagerPciQuantumComputingDelete';

angular.module(moduleName, ['ui.router', deleteDatabase]).config(routing);

export default moduleName;
