import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import activeMonthlyBilling from './active-monthly-billing';
import add from './add';
import backup from './backup';
import deleteInstance from './delete';
import hardReboot from './hard-reboot';
import instance from './instance';
import instances from '../instances/instances.module';
import onboarding from './onboarding';
import reinstall from './reinstall';
import rescue from './rescue';
import resume from './resume';
import routing from './baremetal.routing';
import softReboot from './soft-reboot';
import unrescue from './unrescue';

const moduleName = 'ovhManagerPciBaremetal';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
    activeMonthlyBilling,
    add,
    backup,
    deleteInstance,
    hardReboot,
    instance,
    instances,
    onboarding,
    reinstall,
    rescue,
    resume,
    softReboot,
    unrescue,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
