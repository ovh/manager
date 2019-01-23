import angular from 'angular';

import voicemailDefault from './default';
import management from './management';
import options from './options';
import password from './password';

const moduleName = 'ovhManagerTelephonyVoicemail';

angular.module(moduleName, [
  voicemailDefault,
  management,
  options,
  password,
])
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
