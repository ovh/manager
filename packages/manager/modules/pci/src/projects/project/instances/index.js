import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import instance from './instance';
import activeMonthlyBilling from './active-monthly-billing';
import backup from './backup';
import instancesDelete from './delete';
import reinstall from './reinstall';
import hardReboot from './hard-reboot';
import softReboot from './soft-reboot';
import resume from './resume';
import rescue from './rescue';
import unrescue from './unrescue';

import component from './instances.component';
import service from './instances.service';
import routing from './instances.routing';

const moduleName = 'ovhManagerPciInstances';

angular
  .module(moduleName, [
    instance,
    activeMonthlyBilling,
    backup,
    instancesDelete,
    reinstall,
    hardReboot,
    softReboot,
    resume,
    rescue,
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
