import angular from 'angular';
import 'angular-translate';
import '@uirouter/angularjs';

import components from '../../components';

import routing from './terminate.routing';

const moduleName = 'ovhManagerPciProjectAdditionalIpsFloatingIpsTerminate';

angular
  .module(moduleName, ['ui.router', 'pascalprecht.translate', components])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
