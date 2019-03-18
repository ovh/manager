import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import directive from './directive';

const moduleName = 'ovhManagerPciProjectRename';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .directive('cloudProjectRename', directive)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
