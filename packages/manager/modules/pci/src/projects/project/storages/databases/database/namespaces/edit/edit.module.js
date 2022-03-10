import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import component from './edit.component';
import routing from './edit.routing';
import './edit.styles.scss';

const moduleName = 'ovhManagerPciStoragesDatabaseNamespacesEdit';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .component('ovhManagerPciProjectDatabaseNamespacesEditComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
