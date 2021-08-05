import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';

import container from '../../../containers/container';
import deleteContainer from './delete';
import addUser from './addUser';
import addObject from './object/add';
import deleteObject from './object/delete';
import routing from './object.routing';
import emptyUser from './emptyUser';
import addUserOnObject from './object/addUser';
import emptyUserObject from './object/emptyUser';

const moduleName = 'ovhManagerPciStoragesObjectsObjectObject';

angular
  .module(moduleName, [
    container,
    addObject,
    addUserOnObject,
    emptyUserObject,
    deleteContainer,
    addUser,
    deleteObject,
    emptyUser,
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
