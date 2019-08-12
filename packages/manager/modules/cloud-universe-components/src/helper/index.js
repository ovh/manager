import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'angular-ui-bootstrap';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import cucConfig from '../config';
import cuiModal from '../cui/modal';

import ControllerHelper from './controller/service';
import ControllerModalHelper from './controller/modal/service';
import ControllerNavigationHelper from './controller/navigation/service';
import ControllerRequestHelper from './controller/request/service';
import OrderHelperService from './order/service';
import ServiceHelper from './service/service';
import UrlHelper from './url/service';

const moduleName = 'cucHelper';

angular
  .module(moduleName, [
    cucConfig,
    cuiModal,
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.bootstrap',
  ])
  .service('CucControllerHelper', ControllerHelper)
  .service('CucControllerModalHelper', ControllerModalHelper)
  .service('CucControllerNavigationHelper', ControllerNavigationHelper)
  .service('CucControllerRequestHelper', ControllerRequestHelper)
  .service('CucOrderHelperService', OrderHelperService)
  .service('CucServiceHelper', ServiceHelper)
  .service('CucUrlHelper', UrlHelper)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
