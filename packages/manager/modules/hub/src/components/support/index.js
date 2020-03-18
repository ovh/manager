import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-ui-angular';
import component from './component';

import './index.scss';

const moduleName = 'ovhManagerHubSupport';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
  ])
  .component('ovhManagerHubSupport', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
