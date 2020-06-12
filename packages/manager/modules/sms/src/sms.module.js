import angular from 'angular';

import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'oclazyload';
import 'ovh-api-services';

import routing from './sms.routing';
import component from './sms.component';

import '@ovh-ux/ui-kit/dist/css/oui.css';
import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';

const moduleName = 'ovhManagerSms';

angular
  .module(moduleName, [
    'ui.router',
    'oc.lazyLoad',
    'ovh-api-services',
    'ovhManagerCore',
  ])
  .config(routing)
  .component('ovhManagerSms', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
