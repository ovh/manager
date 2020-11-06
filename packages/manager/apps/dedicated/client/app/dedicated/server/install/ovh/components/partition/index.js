import angular from 'angular';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import './index.scss';

import component from './component';

const moduleName = 'ovhManagerDedicatedServerInstallOvhPartition';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(component.name, component);

export default moduleName;
