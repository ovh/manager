import angular from 'angular';

import campaigns from './campaigns';
import convertToVoiceFax from './convertToVoicefax';
import customDomains from './customDomains';
import filtering from './filtering';

const moduleName = 'ovhManagerTelephonyServiceFax';

angular.module(moduleName, [
  campaigns,
  convertToVoiceFax,
  customDomains,
  filtering,
])
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
