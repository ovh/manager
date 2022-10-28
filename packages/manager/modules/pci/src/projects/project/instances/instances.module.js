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
import instancesDelete from './delete';
import onboarding from './onboarding';
import reinstall from './reinstall';
import rescue from './rescue';
import resume from './resume';
import shelve from './shelve';
import softReboot from './soft-reboot';
import start from './start';
import stop from './stop';
import unrescue from './unrescue';
import unshelve from './unshelve';
import createPrivateNetworkWarning from './create-private-network-warning';

import component from './instances.component';
import routing from './instances.routing';
import service from './instances.service';

import './instances.scss';

const moduleName = 'ovhManagerPciInstances';

angular
  .module(moduleName, [
    activeMonthlyBilling,
    add,
    backup,
    hardReboot,
    help,
    instance,
    instancesDelete,
    onboarding,
    reinstall,
    rescue,
    resume,
    shelve,
    softReboot,
    start,
    stop,
    unrescue,
    unshelve,
    createPrivateNetworkWarning,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .config(routing)
  .component('pciProjectsProjectInstances', component)
  .service('PciProjectsProjectInstanceService', service)
  .run(($injector) => {
    const $ocLazyLoad = $injector.get('$ocLazyLoad');
    if ($injector.get('coreConfig')?.getRegion() === 'US') {
      return import(
        '../private-networks/legacy/private-networks.module'
      ).then((mod) => $ocLazyLoad.inject(mod.default || mod));
    }
    return import('../private-networks/private-networks.module').then((mod) =>
      $ocLazyLoad.inject(mod.default || mod),
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
