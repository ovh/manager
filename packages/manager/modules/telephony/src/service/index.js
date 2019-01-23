import angular from 'angular';

import assist from './assist';
import consumption from './consumption';
import contact from './contact';
import fax from './fax';
import timeCondition from './time-condition';
import voicemail from './voicemail';

const moduleName = 'ovhManagerTelephonyService';

angular.module(moduleName, [
  assist,
  consumption,
  contact,
  fax,
  timeCondition,
  voicemail,
])
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
