import angular from 'angular';
import '@uirouter/angularjs';
import ovhManagerAdvices from '@ovh-ux/manager-advices';

import component from './telecom-sms-dashboard.component';
import routing from './routing';

import './telecom-sms-dashboard.scss';

const moduleName = 'ovhManagerSmsDashboardModule';

angular
  .module(moduleName, ['ui.router', ovhManagerAdvices])
  .component(component.name, component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
