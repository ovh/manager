import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import add from './add';
import deleteModule from './delete';

import routing from './rule.routing';

const moduleName = 'ovhManagerDedicatedIpFirewallGameRule';

angular
  .module(moduleName, [
    add,
    deleteModule,
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ../translations */);

export default moduleName;
