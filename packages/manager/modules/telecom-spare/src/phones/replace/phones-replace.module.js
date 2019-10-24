import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';
import 'ovh-api-services';

import component from './phones-replace.component';
import routing from './phones-replace.routing';

const moduleName = 'ovhManagerTelecomSparePhonesReplace';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ovh-api-services',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('replacePhonesSpare', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
