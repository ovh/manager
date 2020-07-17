import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';
import 'ovh-api-services';

import '@ovh-ux/manager-core';

import component from './overtheboxes.component';
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
  ])
  .config(routing)
  .component('ovhManagerOverTheBoxes', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
