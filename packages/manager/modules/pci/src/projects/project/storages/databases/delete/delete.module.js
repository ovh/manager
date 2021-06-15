import angular from 'angular';
import '@uirouter/angularjs';

import deleteDatabase from '../components/delete-database';
import routing from './delete.routing';

const moduleName = 'ovhManagerPciStoragesDatabasesDelete';

angular.module(moduleName, ['ui.router', deleteDatabase]).config(routing);

export default moduleName;
