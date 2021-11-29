import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import 'angular-translate';
import 'ovh-api-services';

import './add.less';

import flavorBilling from '../../../../components/project/flavor-billing';
import flavorsList from '../../../../components/project/flavors-list';
import imagesList from '../../../../components/project/images-list';
import regionsList from './regions-list';
import sshKeys from '../../../../components/project/instance/ssh-keys';
import trustedZoneBanner from '../../../../components/trusted-zone-banner';

import component from './add.component';
import routing from './add.routing';

const moduleName = 'ovhManagerPciInstancesAdd';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'ngOvhCloudUniverseComponents',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    flavorBilling,
    flavorsList,
    imagesList,
    regionsList,
    sshKeys,
    trustedZoneBanner,
  ])
  .config(routing)
  .component('ovhManagerPciInstancesAdd', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
