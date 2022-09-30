import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import component from './general-information.component';
import routing from './general-information.routing';

import updateScalingModule from './update-scaling';
import stopModule from './stop';
import deleteModule from './delete';
import startModule from './start';
import updateImageModule from './update-image';

const moduleName = 'ovhManagerPciAppGeneralInformation';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ui.router',
    updateScalingModule,
    stopModule,
    deleteModule,
    startModule,
    updateImageModule,
  ])
  .config(routing)
  .component('ovhManagerPciProjectAppGeneralInformation', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
