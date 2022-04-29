import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';

import editNameComponentModule from '../../../components/edit-name';

import routing from './edit-name.routing';

const moduleName = 'ovhManagerNashaDashboardGeneralInformationEditName';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'ui.router',
    editNameComponentModule,
  ])
  .config(routing);

export default moduleName;
