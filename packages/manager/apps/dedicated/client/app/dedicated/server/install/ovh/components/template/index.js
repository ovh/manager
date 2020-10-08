import angular from 'angular';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './component';

import './index.scss';

const moduleName = 'ovhManagerDedicatedServerInstallOvhTemplate';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(component.name, component);

export default moduleName;
