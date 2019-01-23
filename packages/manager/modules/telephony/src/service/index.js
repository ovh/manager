import angular from 'angular';

import assist from './assist';
import consumption from './consumption';

const moduleName = 'ovhManagerTelephonyService';

angular.module(moduleName, [
  assist,
  consumption,
])
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
