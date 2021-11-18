import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';

import labs from '../../../components/project/labs';
import apps from './apps';
import tokens from './tokens';

import component from './ai.component';
import routing from './ai.routing';
import service from './ai.service';

const moduleName = 'ovhManagerPciAi';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    labs,
    apps,
    tokens,
  ])
  .config(routing)
  .component('pciProjectAi', component)
  .service('PciProjectAiService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
