import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-utils';
import '@ovh-ux/ng-ovh-web-universe-components';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import routing from './state.routing';

import oom from '../oom';

const moduleName = 'ovhManagerPrivateDatabaseState';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'ngOvhUtils',
    'ngOvhWebUniverseComponents',
    'oui',
    'ui.router',
    oom,
  ])
  .config(routing);

export default moduleName;
