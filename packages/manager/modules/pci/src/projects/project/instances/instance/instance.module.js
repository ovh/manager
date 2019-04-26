import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import activeMonthlyBilling from './active-monthly-billing';
import attachPrivateNetwork from './attach-private-network';
import attachVolume from './attach-volume';
import backup from './backup';
import deleteInstance from './delete';
import hardReboot from './hard-reboot';
import reinstall from './reinstall';
import rescue from './rescue';
import resume from './resume';
import softReboot from './soft-reboot';
import unrescue from './unrescue';
import vnc from './vnc';

import component from './instance.component';
import routing from './instance.routing';

const moduleName = 'ovhManagerPciInstance';

angular
  .module(moduleName, [
    'ngOvhOtrs',
    'ui.router',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    activeMonthlyBilling,
    attachPrivateNetwork,
    attachVolume,
    backup,
    deleteInstance,
    hardReboot,
    reinstall,
    rescue,
    resume,
    softReboot,
    unrescue,
    vnc,
  ])
  .config(routing)
  .component('pciProjectsProjectInstancesInstance', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
