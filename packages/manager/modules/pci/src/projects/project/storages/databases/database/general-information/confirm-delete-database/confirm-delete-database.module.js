import angular from 'angular';
import '@uirouter/angularjs';

import deleteDatabase from '../../../confirm-delete/confirm-delete.module';
import routing from './confirm-delete-database.routing';

const moduleName =
  'ovhManagerPciStoragesDatabaseGeneralInformationConfirmDeleteDatabase';

angular.module(moduleName, ['ui.router', deleteDatabase]).config(routing);

export default moduleName;
