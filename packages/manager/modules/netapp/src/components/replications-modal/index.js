import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import component from './component';

const moduleName = 'ovhManagerReplicationsModalComponent';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'oui',
    'ngSanitize',
    'ngTranslateAsyncLoader',
  ])
  .component(moduleName, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
