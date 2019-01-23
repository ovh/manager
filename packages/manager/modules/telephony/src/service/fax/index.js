import angular from 'angular';

import campaigns from './campaigns';
import convertToVoiceFax from './convertToVoicefax';
import customDomains from './customDomains';
import filtering from './filtering';
import password from './password';

const moduleName = 'ovhManagerTelephonyServiceFax';

angular.module(moduleName, [
  campaigns,
  convertToVoiceFax,
  customDomains,
  filtering,
  password,
])
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
