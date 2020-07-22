import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'oclazyload';
import 'ovh-api-services';

import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import routing from './sms.routing';

import '@ovh-ux/ui-kit/dist/css/oui.css';
import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';

const moduleName = 'ovhManagerSms';

angular
  .module(moduleName, [
    'ui.router',
    'oc.lazyLoad',
    'ovh-api-services',
    'ovhManagerCore',
    'pascalprecht.translate',
    ListLayoutHelper.moduleName,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
