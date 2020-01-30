import angular from 'angular';
import '@uirouter/angularjs';

import addUser from '../../add/user-add';
import roles from './roles';
import routing from './add.routing';

const moduleName = 'ovhManagerPciUsersOnboardingAdd';

angular.module(moduleName, [addUser, roles, 'ui.router']).config(routing);

export default moduleName;
