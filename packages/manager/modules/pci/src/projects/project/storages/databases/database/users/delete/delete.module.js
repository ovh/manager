import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';

import deleteComponent from '../../../../../../../components/project/users/delete';
import routing from './delete.routing';

const moduleName = 'ovhManagerPciStoragesDatabaseUsersDelete';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
    'oui',
    deleteComponent,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
