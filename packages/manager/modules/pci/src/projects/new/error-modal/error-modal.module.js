import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import 'angular-translate';

import component from './error-modal.component';
import routing from './error-modal.routing';

const moduleName = 'ovhManagerPciProjectErrorModal';

angular
  .module(moduleName, [
    'oui',
    'ui.router',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('pciProjectErrorModal', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
