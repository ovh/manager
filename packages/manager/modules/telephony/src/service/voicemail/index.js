import angular from 'angular';

import voicemailDefault from './default';

const moduleName = 'ovhManagerTelephonyVoicemail';

angular.module(moduleName, [
  voicemailDefault,
])
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
