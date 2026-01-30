import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import ngOvhChart from '@ovh-ux/ng-ovh-chart';

import component from './telecom-sms-statistics.component';
import routing from './telecom-sms-statistics.routing';
import service from './telecom-sms-statistics.service';

const moduleName = 'ovhManagerSmsStatistics';

angular
  .module(moduleName, ['ui.router', 'pascalprecht.translate', ngOvhChart])
  .component('ovhManagerSmsStatisticsComponent', component)
  .service('SmsStatisticsService', service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
