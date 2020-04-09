import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import deleteModule from './delete';
import descriptionEdit from './description-edit';
import move from './move';

import routing from './block.routing';

const moduleName = 'ovhManagerDedicatedIpDashboardBlock';

angular
  .module(moduleName, [
    deleteModule,
    descriptionEdit,
    move,
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ../../translations */);

export default moduleName;
