import angular from 'angular';

import campaigns from './campaigns';
import convertToVoiceFax from './convertToVoicefax';
import customDomains from './customDomains';
import filtering from './filtering';
import password from './password';
import settings from './settings';

const moduleName = 'ovhManagerTelephonyServiceFax';

angular.module(moduleName, [
  campaigns,
  convertToVoiceFax,
  customDomains,
  filtering,
  password,
  settings,
])
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
