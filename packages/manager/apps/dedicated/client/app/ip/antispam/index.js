import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import detail from './detail';

import component from './antispam.component';
import routing from './antispam.routing';
import service from './antispam.service';

const moduleName = 'ovhManagerDedicatedIpAntispam';

angular
  .module(moduleName, [detail, 'oui', 'pascalprecht.translate', 'ui.router'])
  .component('ipAntispam', component)
  .service('IpSpam', service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ../translations */);

export default moduleName;
