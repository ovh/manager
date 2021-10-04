import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import showSecretComponent from './show-secret.component';
import routing from './show-secret.routing';

const moduleName = 'ovhManagerPciStoragesDatabaseUsersShowSecret';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ui.router',
  ])
  .config(routing)
  .component(
    'ovhManagerPciStoragesDatabaseUsersShowSecretComponent',
    showSecretComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
