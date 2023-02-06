import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';

import routing from './iam.routing';

const moduleName = 'ovhManagerIAM';

angular
  .module(moduleName, ['ui.router', 'pascalprecht.translate'])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
