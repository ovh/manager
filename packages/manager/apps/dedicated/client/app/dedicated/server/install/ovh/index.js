import angular from 'angular';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';
import installTemplate from './components/template';
import installRaid from './components/raid';
import installPartition from './components/partition';
import installRtm from './components/rtm';
import installOptions from '../components/options';

import routing from './routing';
import component from './component';
import service from './service';

const moduleName = 'ovhManagerDedicatedServerInstallOvh';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ui.router',
    ngOvhApiWrappers,
    installTemplate,
    installRaid,
    installPartition,
    installRtm,
    installOptions,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(component.name, component)
  .service('dedicatedServerInstallOvh', service);

export default moduleName;
