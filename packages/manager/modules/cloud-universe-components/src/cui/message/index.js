import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import component from './component';

const moduleName = 'cuiMessage';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('cuiMessageContainer', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
