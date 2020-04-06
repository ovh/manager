import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import 'ovh-ui-kit/dist/oui.css';
import './aliases-link.scss';

import component from './aliases-link.component';
import dualList from '../../../components/dual-list';
import routing from './aliases-link.routing';

const moduleName = 'ovhManagerDbaasLogsDetailAliasesLink';

angular
  .module(moduleName, [
    'angularMoment',
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    dualList,
  ])
  .config(routing)
  .component('dbaasLogsDetailAliasesLink', component);

export default moduleName;
