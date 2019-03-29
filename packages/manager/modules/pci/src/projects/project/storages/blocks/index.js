import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'oclazyload';
import 'ovh-ui-angular';
import 'ovh-api-services';
import 'angular-ui-bootstrap';

// import add from './add';
import block from './block';

import component from './blocks.component';
import service from './blocks.service';

import routing from './blocks.routing';

const moduleName = 'ovhManagerPciStoragesBlocks';

angular
  .module(moduleName, [
    // add,
    block,
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    'ui.bootstrap',
  ])
  .config(routing)
  .component('pciProjectStorageBlocks', component)
  .service('PciProjectStorageBlockService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
