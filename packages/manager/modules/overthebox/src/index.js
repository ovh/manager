import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import '@ovh-ux/manager-core';

import { OTB_AVAILABILITY } from './feature-availability/feature-availability.constants';

import overTheBox from './overthebox';

import component from './overtheboxes.component';
import routing from './overtheboxes.routing';

const moduleName = 'ovhManagerOverTheBoxes';

angular
  .module(moduleName, [
    'ui.router',
    'ovhManagerCore',
    'oc.lazyLoad',
    overTheBox,
  ])
  .config(routing)
  .component('ovhManagerOverTheBoxes', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export {
  OTB_AVAILABILITY,
};

export default moduleName;
