import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import addEditComponent from './add-edit.component';
import routing from './add-edit.routing';

const moduleName = 'ovhManagerPciStoragesDatabasePoolsAddEdit';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ui.router',
  ])
  .config(routing)
  .component(
    'ovhManagerPciStoragesDatabasePoolsAddEditComponent',
    addEditComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
