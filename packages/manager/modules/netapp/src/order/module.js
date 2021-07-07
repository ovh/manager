import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';
import { region } from '@ovh-ux/manager-components';

import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerNetAppOrder';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    region,
  ])
  .config(routing)
  .component('ovhManagerNetAppOrder', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
