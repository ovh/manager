import angular from 'angular';

import campaigns from './campaigns';
import convertToVoiceFax from './convertToVoicefax';
import customDomains from './customDomains';

const moduleName = 'ovhManagerTelephonyServiceFax';

angular.module(moduleName, [
  campaigns,
  convertToVoiceFax,
  customDomains,
])
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
