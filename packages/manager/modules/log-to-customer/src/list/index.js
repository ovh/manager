import angular from 'angular';
import 'angular-translate';

import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import ngOvhSwimmingPoll from '@ovh-ux/ng-ovh-swimming-poll';
import component from './component';

import './index.less';
import service from '../service';

const moduleName = 'ovhLogToCustomerList';

angular
  .module(moduleName, [ListLayoutHelper.moduleName, ngOvhSwimmingPoll])
  .component('logToCustomerList', component)
  .service('LogToCustomerService', service)
  .run(/* @ngTranslationsInject:json ../translations */);

export default moduleName;
