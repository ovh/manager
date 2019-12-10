/**
 * @ngdoc overview
 * @name ng-ovh-contracts
 * @description
 * # contracts
 *
 * Main module of the application.
 */
import angular from 'angular';
import 'angular-translate';
import 'angular-ui-bootstrap';

import directive from './directive';

import './index.less';

const moduleName = 'ngOvhContracts';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'ui.bootstrap',
  ])
  .directive('ovhContracts', directive)
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
