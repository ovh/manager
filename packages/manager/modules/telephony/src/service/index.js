import angular from 'angular';

import assist from './assist';

const moduleName = 'ovhManagerTelephonyService';

angular.module(moduleName, [
  assist,
])
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
