import angular from 'angular';

import campaigns from './campaigns';
import convertToVoiceFax from './convertToVoicefax';

const moduleName = 'ovhManagerTelephonyServiceFax';

angular.module(moduleName, [
  campaigns,
  convertToVoiceFax,
])
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
