import angular from 'angular';
import '@uirouter/angularjs';

import deleteDatabase from '../../../components/delete-database';
import routing from './delete-database.routing';

const moduleName =
  'ovhManagerPciStoragesDatabaseGeneralInformationDeleteDatabase';

angular.module(moduleName, ['ui.router', deleteDatabase]).config(routing);

export default moduleName;
