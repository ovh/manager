import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';
import 'ovh-api-services';

import '@ovh-ux/manager-core';

import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import routing from './overtheboxes.routing';

import '@ovh-ux/ui-kit/dist/css/oui.css';
import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';

const moduleName = 'ovhManagerOverTheBoxes';

angular
  .module(moduleName, [
    'ui.router',
    'ovhManagerCore',
    'oc.lazyLoad',
    'ovh-api-services',
    ListLayoutHelper.moduleName,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
