import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import routing from './routing';
import component from './component';

import './index.scss';

const moduleName = 'signUpIncomplete';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(component.name, component);

export default moduleName;
