import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import 'angular-translate';
import 'ovh-api-services';

import flavorBilling from '../../../../../components/project/flavor-billing';
import flavorsList from '../../../../../components/project/flavors-list';
import sshKeys from '../../../../../components/project/instance/ssh-keys';
import trustedZoneBanner from '../../../../../components/trusted-zone-banner';

import instances from '../../../instances/instances.module';

import component from './add.component';
import routing from './add.routing';

const moduleName = 'ovhManagerPciInstancesBackupsAdd';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'ngOvhCloudUniverseComponents',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    instances,
    flavorBilling,
    flavorsList,
    sshKeys,
    trustedZoneBanner,
  ])
  .config(routing)
  .component('ovhManagerPciInstancesBackupsAdd', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
