import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import component from './detail.component';
import routing from './detail.routing';

const moduleName = 'ovhManagerDedicatedIpAntispamDetail';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component('ipAntispamDetail', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ../../translations */);

export default moduleName;
