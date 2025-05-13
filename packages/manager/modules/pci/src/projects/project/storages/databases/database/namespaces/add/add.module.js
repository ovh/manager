import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import component from './add.component';
import routing from './add.routing';
import './add.styles.scss';

const moduleName = 'ovhManagerPciStoragesDatabaseNamespacesAdd';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .component('ovhManagerPciProjectDatabaseNamespacesAddComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
