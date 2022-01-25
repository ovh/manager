import angular from 'angular';
import 'angular-translate';
import 'oclazyload';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import component from './disclaimer.component';
import routing from './disclaimer.routing';

const moduleName = 'ovhManagerIpByoipDisclaimer';

angular
  .module(moduleName, [
    'oc.lazyLoad',
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .component('ipByoipDisclaimerComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
