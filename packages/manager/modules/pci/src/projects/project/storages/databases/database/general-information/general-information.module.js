import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import addNode from './add-node';
import deleteNode from './delete-node';
import component from './general-information.component';
import deleteDatabase from './delete-database';
import confirmDeleteDatabase from './confirm-delete-database';
import editName from './edit-name';
import node from '../../components/node';
import routing from './general-information.routing';
import upgradePlan from './upgrade-plan';
import upgradeVersion from './upgrade-version';
import upgradeNode from './upgrade-node';

const moduleName = 'ovhManagerPciStoragesDatabaseGeneralInformation';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ui.router',
    addNode,
    deleteNode,
    deleteDatabase,
    confirmDeleteDatabase,
    editName,
    node,
    upgradePlan,
    upgradeVersion,
    upgradeNode,
  ])
  .config(routing)
  .component('ovhManagerPciProjectDatabaseGeneralInformation', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
