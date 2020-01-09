import angular from 'angular';
import '@uirouter/angularjs';

import service from './email-domain.service';
import upgradeComponent from './upgrade.component';

const moduleName = 'webEmailDomainUpgradeModule';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('webEmailDomainUpgrade', upgradeComponent)
  .service('EmailDomainService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
