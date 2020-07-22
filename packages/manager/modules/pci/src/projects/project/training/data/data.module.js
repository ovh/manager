import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';
import 'ovh-api-services';

import list from './list';
import add from './add';
import component from './data.component';
import routing from './data.routing';
import service from './data.service';

const moduleName = 'ovhManagerPciTrainingData';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    list,
    add,
  ])
  .config(routing)
  .component('pciProjectTrainingDataComponent', component)
  .service('PciProjectTrainingDataService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
