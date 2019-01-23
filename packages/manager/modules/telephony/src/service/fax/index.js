import angular from 'angular';

import campaigns from './campaigns';

const moduleName = 'ovhManagerTelephonyServiceFax';

angular.module(moduleName, [
  campaigns,
])
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
