import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';
import 'ovh-api-services';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import '@ovh-ux/manager-core';
import ngOvhChart from '@ovh-ux/ng-ovh-chart';

import component from './overtheboxes.component';
import routing from './overtheboxes.routing';

const moduleName = 'ovhManagerOverTheBox';

angular
  .module(moduleName, [
    'ui.router',
    'ovhManagerCore',
    'oc.lazyLoad',
    'ovh-api-services',
    ngAtInternet,
    ngOvhChart,
  ])
  .config(routing)
  .component('ovhManagerOverTheBoxes', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
