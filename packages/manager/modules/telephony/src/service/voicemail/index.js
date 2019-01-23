import angular from 'angular';

import voicemailDefault from './default';
import management from './management';

const moduleName = 'ovhManagerTelephonyVoicemail';

angular.module(moduleName, [
  voicemailDefault,
  management,
])
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
