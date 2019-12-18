import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';

import attachVolume from '../../../instances/instance/attach-volume/attach-volume.module';
import routing from './attach-volume.routing';

const moduleName = 'ovhManagerPciBaremetalInstanceAttachVolume';

angular
  .module(moduleName, [
    attachVolume,
    'ui.router',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing);

export default moduleName;
