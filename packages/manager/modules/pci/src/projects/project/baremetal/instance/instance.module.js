import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import activeMonthlyBilling from './active-monthly-billing';
import applicationAccess from './application-access';
import attachPrivateNetwork from './attach-private-network';
import attachVolume from './attach-volume';
import backup from './backup';
import baremetalInstanceModule from '../../instances/instance/instance.module';
import deleteModule from './delete';
import edit from './edit';
import hardReboot from './hard-reboot';
import reinstall from './reinstall';
import rescue from './rescue';
import resume from './resume';
import routing from './instance.routing';
import softReboot from './soft-reboot';
import unrescue from './unrescue';

const moduleName = 'ovhManagerPciBaremetalInstance';

angular
  .module(moduleName, [
    'ui.router',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    activeMonthlyBilling,
    applicationAccess,
    attachPrivateNetwork,
    attachVolume,
    backup,
    baremetalInstanceModule,
    deleteModule,
    edit,
    hardReboot,
    reinstall,
    rescue,
    resume,
    softReboot,
    unrescue,
  ])
  .config(routing);

export default moduleName;
