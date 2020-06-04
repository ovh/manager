import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';
import 'ovh-api-services';

import '@ovh-ux/manager-core';

import component from './overtheboxes.component';
import routing from './overtheboxes.routing';

import 'ovh-ui-kit/dist/oui.css';
import 'ovh-ui-kit/dist/oui-olt.css';
import 'ovh-ui-kit-bs/dist/ovh-ui-kit-bs.min.css';
import 'ovh-ui-kit-bs/dist/oui-bs3-olt.css';

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
