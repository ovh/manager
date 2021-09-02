import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import addUser from './add';
import deleteUser from './delete';
import modifyPassword from './modify-password';
import showSecret from './show-secret';
import routing from './users.routing';
import users from '../../../../../../components/project/users';

const moduleName = 'ovhManagerPciStoragesDatabaseUsers';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    addUser,
    deleteUser,
    modifyPassword,
    users,
    showSecret,
  ])
  .config(routing);

export default moduleName;
