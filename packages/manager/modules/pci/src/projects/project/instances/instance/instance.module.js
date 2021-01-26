import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import ovhManagerAdvices from '@ovh-ux/manager-advices';

import activeMonthlyBilling from './active-monthly-billing';
import applicationAccess from './application-access';
import attachPrivateNetwork from './attach-private-network';
import attachVolume from './attach-volume';
import backup from './backup';
import deleteInstance from './delete';
import edit from './edit';
import hardReboot from './hard-reboot';
import reinstall from './reinstall';
import rescue from './rescue';
import resume from './resume';
import shelve from './shelve';
import softReboot from './soft-reboot';
import start from './start';
import stop from './stop';
import unrescue from './unrescue';
import vnc from './vnc';

import component from './instance.component';
import routing from './instance.routing';

const moduleName = 'ovhManagerPciInstance';

angular
  .module(moduleName, [
    'ui.router',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    ovhManagerAdvices,
    activeMonthlyBilling,
    applicationAccess,
    attachPrivateNetwork,
    attachVolume,
    backup,
    deleteInstance,
    edit,
    hardReboot,
    reinstall,
    rescue,
    resume,
    shelve,
    softReboot,
    start,
    stop,
    unrescue,
    vnc,
  ])
  .config(routing)
  .component('pciProjectsProjectInstancesInstance', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
