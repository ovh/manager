import angular from 'angular';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import image from './image';
import ovh from './ovh';
import template from './template';

import routing from './routing';
import component from './component';

const moduleName = 'ovhManagerDedicatedServerInstall';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ui.router',
    image,
    ovh,
    template,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(component.name, component);

export default moduleName;
