import angular from 'angular';

import logs from './logs';
import orders from './orders';
import support from './support';

const moduleName = 'ovhManagerTelephonyServiceAssist';

angular.module(moduleName, [
  logs,
  orders,
  support,
])
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
