import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';
import 'angular-ui-bootstrap';

import cucHelper from '../helper';

import service from './service';

const moduleName = 'cucVrack';

angular
  .module(moduleName, [
    cucHelper,
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.bootstrap',
    'ui.router',
  ])
  .service('CucVrackService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
