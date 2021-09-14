import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ui-kit';

import backupsComponent from './backups.component';
import routing from './backups.routing';
import restore from './restore';
import fork from './fork';

const moduleName = 'ovhManagerPciStoragesDatabaseBackups';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngOvhCloudUniverseComponents',
    'oui',
    'ui.router',
    restore,
    fork,
  ])
  .config(routing)
  .component('ovhManagerPciStoragesDatabaseBackupsComponent', backupsComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
