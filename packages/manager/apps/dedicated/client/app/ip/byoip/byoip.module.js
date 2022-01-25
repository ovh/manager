import angular from 'angular';
import 'angular-translate';
import 'oclazyload';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import component from './byoip.component';
import routing from './byoip.routing';
import service from './byoip.service';

import disclaimer from './disclaimer';

const moduleName = 'ovhManagerIpByoip';

angular
  .module(moduleName, [
    'oc.lazyLoad',
    'oui',
    'pascalprecht.translate',
    'ui.router',
    disclaimer,
  ])
  .config(routing)
  .component('ipByoipComponent', component)
  .service('ByoipService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
