import angular from 'angular';

import emailDomainService from './email-domain.service';
import upgradeModule from './upgrade.module';

const moduleName = 'webEmailDomainUpgrade';

angular
  .module(moduleName, [upgradeModule])
  .service('EmailDomainService', emailDomainService);

export default moduleName;
