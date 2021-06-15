import angular from 'angular';
import '@uirouter/angularjs';

import deleteComponent from '../../../../components/project/users/delete';
import routing from './delete.routing';

const moduleName = 'ovhManagerPciUsersDeleteDelete';

angular
  .module(moduleName, ['ui.router', 'oui', deleteComponent])
  .config(routing);

export default moduleName;
