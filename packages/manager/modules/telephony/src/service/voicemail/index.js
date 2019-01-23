import angular from 'angular';

import voicemailDefault from './default';
import management from './management';
import options from './options';

const moduleName = 'ovhManagerTelephonyVoicemail';

angular.module(moduleName, [
  voicemailDefault,
  management,
  options,
])
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
