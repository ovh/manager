import angular from 'angular';
import '@uirouter/angularjs';

import routing from './upgrade.routing';
import upgradeComponent from './upgrade.component';

const moduleName = 'webEmailDomainUpgradeModule';

angular
  .module(moduleName, [
    'oui',
    'ui.router',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('webEmailDomainUpgrade', upgradeComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
