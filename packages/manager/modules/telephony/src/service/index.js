import angular from 'angular';

import assist from './assist';
import consumption from './consumption';
import contact from './contact';

const moduleName = 'ovhManagerTelephonyService';

angular.module(moduleName, [
  assist,
  consumption,
  contact,
])
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
