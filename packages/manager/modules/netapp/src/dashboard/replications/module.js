import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-utils';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';

import component from './component';
import routing from './routing';

import approuveReplication from './approuve';
import promoteReplication from './promote';
import deleteReplication from './delete';

import './style.scss';

const moduleName = 'ovhManagerNetAppReplications';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'ngOvhUtils',
    'pascalprecht.translate',
    'ui.router',
    approuveReplication,
    promoteReplication,
    deleteReplication,
  ])
  .component(moduleName, component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
