import angular from 'angular';
import '@ovh-ux/ng-pagination-front';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import '@ovh-ux/ng-ovh-utils';

import routing from './list.routing';

const moduleName = 'ovhManagerPrivateDatabaseDatabaseList';

angular
  .module(moduleName, ['ngPaginationFront', 'oui', 'ui.router', 'ngOvhUtils'])
  .config(routing);

export default moduleName;
