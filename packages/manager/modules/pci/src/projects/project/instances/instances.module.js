import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import activeMonthlyBilling from './active-monthly-billing';
import add from './add';
import backup from './backup';
import hardReboot from './hard-reboot';
import help from './help';
import instance from './instance';
import start from './start';
import stop from './stop';
import instancesDelete from './delete';
import onboarding from './onboarding';
import reinstall from './reinstall';
import regionsList from './add/regions-list';
import rescue from './rescue';
import resume from './resume';
import softReboot from './soft-reboot';
import unrescue from './unrescue';

import privateNetworks from '../private-networks/private-networks.module';

import component from './instances.component';
import routing from './instances.routing';
import service from './instances.service';

const moduleName = 'ovhManagerPciInstances';

angular
  .module(moduleName, [
    activeMonthlyBilling,
    add,
    backup,
    hardReboot,
    help,
    instance,
    start,
    stop,
    instancesDelete,
    onboarding,
    privateNetworks,
    reinstall,
    regionsList,
    rescue,
    resume,
    softReboot,
    unrescue,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .config(routing)
  .component('pciProjectsProjectInstances', component)
  .service('PciProjectsProjectInstanceService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
