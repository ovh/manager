import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import component from './current-queries.component';
import routing from './current-queries.routing';

import './current-queries.styles.scss';

const moduleName = 'ovhManagerPciStoragesDatabaseCurrentQueries';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ui.router',
  ])
  .config(routing)
  .component('ovhManagerPciProjectDatabaseCurrentQueries', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
