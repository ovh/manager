import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ui-kit';
import ngOvhSwimmingPoll from '@ovh-ux/ng-ovh-swimming-poll';

import add from './add';
import fork from './fork';
import component from './databases.component';
import database from './database';
import deteleDatabase from './delete';
import editName from './edit-name';
import labs from '../../../../components/project/labs';
import node from './components/node';
import onboarding from './onboarding';
import routing from './databases.routing';
import service from './database.service';
import confirmDelete from './confirm-delete';
import databasesWarning from '../../../../components/project/warning-message';

import './index.scss';

const moduleName = 'ovhManagerPciStoragesDatabases';

angular
  .module(moduleName, [
    add,
    fork,
    database,
    deteleDatabase,
    editName,
    labs,
    ngOvhSwimmingPoll,
    node,
    onboarding,
    confirmDelete,
    databasesWarning,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngOvhCloudUniverseComponents',
    'oui',
    'ui.router',
  ])
  .config(routing)
  .component('ovhManagerPciProjectDatabases', component)
  .service('DatabaseService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
