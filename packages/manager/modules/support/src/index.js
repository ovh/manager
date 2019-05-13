import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-api-wrappers';
import '@ovh-ux/ng-ovh-swimming-poll';
import '@uirouter/angularjs';

import 'oclazyload';
import 'ovh-api-services';

import translate from 'angular-translate';
import routing from './routing';

const moduleName = 'ovhManagerSupport';

angular
  .module(moduleName, [
    'ngOvhSwimmingPoll',
    'oc.lazyLoad',
    'ovh-api-services',
    'ovhManagerCore',
    translate,
    'ui.router',
  ])
  .config(routing);

export default moduleName;
