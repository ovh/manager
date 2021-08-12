import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';

import { inlinePropertyEditor } from '@ovh-ux/manager-components';

import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerNetAppVolumesDashboard';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    inlinePropertyEditor,
  ])
  .config(routing)
  .component('ovhManagerNetAppVolumesDashboard', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
