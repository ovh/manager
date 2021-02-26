import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import ovhManagerOrder from '@ovh-ux/manager-order';

import components from './components';
import config from './config';
import payment from './payment';

import routing from './routing';
import component from './component';
import service from './service';

import './index.scss';

const moduleName = 'ovhManagerPciProjectsNew';

angular
  .module(moduleName, [
    'ui.router',
    'ovh-api-services',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    components,
    config,
    ovhManagerOrder,
    payment,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(component.name, component)
  .service('pciProjectNew', service);

export default moduleName;
