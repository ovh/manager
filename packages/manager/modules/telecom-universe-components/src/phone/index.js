import angular from 'angular';
import 'ovh-api-services';

import tucPhoneNumberDirective from './number/phone-number.directive';
import tucPhoneNumberFilter from './number/phone-number.filter';

const moduleName = 'tucPhone';

angular
  .module(moduleName, ['ovh-api-services'])
  .directive('tucPhoneNumber', tucPhoneNumberDirective)
  .filter('tucPhoneNumber', tucPhoneNumberFilter);

export default moduleName;
