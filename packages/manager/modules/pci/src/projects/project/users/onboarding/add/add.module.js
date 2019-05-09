import angular from 'angular';
import '@uirouter/angularjs';

import addUser from '../../add/user-add';
import routing from './add.routing';

const moduleName = 'ovhManagerPciUsersOnboardingAdd';

angular
  .module(moduleName, [
    addUser,
    'ui.router',
  ])
  .config(routing);

export default moduleName;
