import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import addNodes from './component';
import routing from './routing';

const moduleName = 'ovhManagerNutanixAddNutanixNodes';

angular
  .module(moduleName, [
    'oui',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .component('addNutanixNodes', addNodes)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
