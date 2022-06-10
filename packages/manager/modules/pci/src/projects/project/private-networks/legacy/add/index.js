import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';
import '@ovh-ux/ng-ovh-swimming-poll';

import component from './add.component';
import routing from './add.routing';
import service from './add.service';

import popoverTemplate from './api-guide.popover.html';

const moduleName = 'ovhManagerPciPrivateNetworksAdd';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngOvhSwimmingPoll',
    'oui',
    'ovh-api-services',
    'ui.router',
  ])
  .config(routing)
  .component('pciProjectPrivateNetworksAdd', component)
  .service('PciPrivateNetworksAdd', service)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'pci/projects/project/network/private-networks/add/api-guide.popover.html',
        popoverTemplate,
      );
    },
  );

export default moduleName;
