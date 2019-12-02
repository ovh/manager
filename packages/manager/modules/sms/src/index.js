import angular from 'angular';

import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'oclazyload';

import sms from './sms';
import routing from './sms.routing';
import component from './sms.component';

import SMSFeatureAvailability from './feature-availability/feature-availability.class';

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
  SMSFeatureAvailability,
};

export default moduleName;
