import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';
import '@ovh-ux/ng-at-internet';

import labs from '../../../components/project/labs';

import onboarding from './onboarding';
import add from './add';
import deleteNamespace from './delete';
import namespace from './namespace';

import component from './serving.component';
import routing from './serving.routing';
import service from './serving.service';

const moduleName = 'ovhManagerPciServing';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'oui',
    'ngAtInternet',
    'ovh-api-services',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    labs,
    onboarding,
    add,
    namespace,
    deleteNamespace,
  ])
  .config(routing)
  .component('pciProjectServing', component)
  .service('PciProjectServingService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
