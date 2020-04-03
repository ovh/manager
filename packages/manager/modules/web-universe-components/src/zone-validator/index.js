import angular from 'angular';

import WucZoneValidator from './dnsZoneValidator.directive';

const moduleName = 'wucZoneValidator';

angular
  .module(moduleName, [])
  .directive('wucZoneNameValidator', WucZoneValidator);

export default moduleName;
