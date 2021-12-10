import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './general-information.component';
import routing from './general-information.routing';
import storageUsage from '../components/storage-usage';

import renameService from './rename-service';
import addStorage from './add-storage';
import orderPublicIp from './order-public-ip';
import assignPrivateIp from './assign-private-ip';
import softwareUpdate from './software-update';

const moduleName = 'ovhManagerAnthosDashboardGeneralInformation';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'oui',
    'ui.router',
    renameService,
    addStorage,
    orderPublicIp,
    assignPrivateIp,
    storageUsage,
    softwareUpdate,
  ])
  .config(routing)
  .component('anthosDashboardGeneralInformation', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
