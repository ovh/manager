import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './add.component';
import routing from './add.routing';

import coldArchiveConfigurationStepNameArchive from './components/steps/name-archive';

const moduleName = 'ovhManagerPciProjectsProjectStoragesColdArchiveAdd';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    coldArchiveConfigurationStepNameArchive,
  ])
  .config(routing)
  .component('pciProjectsProjectStoragesColdArchiveAdd', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
