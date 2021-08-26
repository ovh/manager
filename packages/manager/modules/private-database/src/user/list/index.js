import angular from 'angular';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import '@ovh-ux/ng-ovh-utils';

import routing from './list.routing';

const moduleName = 'ovhManagerPrivateDatabaseUserList';

angular.module(moduleName, ['oui', 'ui.router', 'ngOvhUtils']).config(routing);

export default moduleName;
