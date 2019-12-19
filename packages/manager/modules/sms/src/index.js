import angular from 'angular';

import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'oclazyload';

import sms from './sms';
import routing from './sms.routing';
import component from './sms.component';

import { SMS_AVAILABILITY } from './feature-availability/feature-availability.constants';

const moduleName = 'ovhManagerSms';

angular.module(moduleName, [
  'ui.router',
  'oc.lazyLoad',
  'ovhManagerCore',
  sms,
])
  .config(routing)
  .component('ovhManagerSms', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export {
  SMS_AVAILABILITY,
};

export default moduleName;
