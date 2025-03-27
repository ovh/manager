import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './component';
import service from '../../nodes/service';

const moduleName = 'ovhManagerNutanixNodeActionMenu';

angular
  .module(moduleName, [
    'oui',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('nodeActionMenu', component)
  .service('NutanixNode', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
