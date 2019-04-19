import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';

import activeMonthlyBilling from './active-monthly-billing';
import backup from './backup';
import deleteInstance from './delete';
import hardReboot from './hard-reboot';
import reinstall from './reinstall';
import rescue from './rescue';
import resume from './resume';
import softReboot from './soft-reboot';
import unrescue from './unrescue';

import dashboard from './dashboard';
import routing from './instance.routing';

const moduleName = 'ovhManagerPciInstance';

angular
  .module(moduleName, [
    'ngOvhOtrs',
    'ui.router',
    dashboard,
    activeMonthlyBilling,
    backup,
    deleteInstance,
    hardReboot,
    reinstall,
    rescue,
    resume,
    softReboot,
    unrescue,
  ])
  .config(routing);

export default moduleName;
