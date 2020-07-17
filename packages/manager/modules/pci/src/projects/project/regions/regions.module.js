import angular from 'angular';
import 'angular-translate';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-ovh-api-wrappers'; // should be a peer dependency of ovh-api-services
import '@ovh-ux/ng-translate-async-loader';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import header from '../../../components/project/quota-region-header';
import component from './regions.component';
import routing from './regions.routing';

const moduleName = 'ovhManagerPciProjectRegions';

angular
  .module(moduleName, [
    header,
    'ovhManagerCore',
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
  ])
  .component('pciProjectRegions', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
