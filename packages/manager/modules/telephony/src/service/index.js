import angular from 'angular';

import assist from './assist';
import consumption from './consumption';
import contact from './contact';
import fax from './fax';
import timeCondition from './time-condition';

const moduleName = 'ovhManagerTelephonyService';

angular.module(moduleName, [
  assist,
  consumption,
  contact,
  fax,
  timeCondition,
])
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
