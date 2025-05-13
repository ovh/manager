import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import deleteComponent from './delete.component';
import routing from './delete.routing';

const moduleName = 'ovhManagerPciStoragesDatabaseAllowedIpsDelete';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ui.router',
  ])
  .config(routing)
  .component(
    'ovhManagerPciStoragesDatabaseAllowedIpsDeleteComponent',
    deleteComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
