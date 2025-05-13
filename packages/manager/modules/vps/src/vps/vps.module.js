import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';
import 'angular-ui-bootstrap';

import '@ovh-ux/manager-filters';
import ovhManagerCore from '@ovh-ux/manager-core';
import ngUiRouterLayout from '@ovh-ux/ng-ui-router-layout';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngOvhCloudUniverseComponents from '@ovh-ux/ng-ovh-cloud-universe-components';
import ngOvhDocUrl from '@ovh-ux/ng-ovh-doc-url';
import ngOvhUserPref from '@ovh-ux/ng-ovh-user-pref';
import { region, sshKeySelector } from '@ovh-ux/manager-components';

import VpsTaskService from './vps-task.service';
import VpsNotificationIpv6Service from '../import/notification.service';
import VpsService from '../import/vps.service';
import VpsUpgradeService from '../import/vps-upgrade.service';
import VpsHelperService from '../import/helper.service';

import detailComponent from '../detail/vps-detail.component';
import headerComponent from '../header/vps-header.component';
import routing from './routing';

import ovhManagerVpsAdditionnalDisk from '../additional-disk';
import ovhManagerVpsBackupStorage from '../backup-storage';
import ovhManagerVpsCloudDatabase from '../cloud-database';
import ovhManagerVpsDashboard from '../dashboard';
import ovhManagerVpsMonitoring from '../monitoring';
import ovhManagerVpsSecondaryDns from '../secondary-dns';
import ovhManagerVpsSnapshot from '../snapshot';
import ovhManagerVpsUpscale from '../upscale';
import ovhManagerVpsUpgrade from '../upgrade';
import ovhManagerVpsVeeam from '../veeam';
import ovhManagerVpsWindows from '../windows';

import '@ovh-ux/ui-kit/dist/css/oui.css';
import './vps.less';
import './vps.scss';

const moduleName = 'ovhManagerVps';

angular
  .module(moduleName, [
    ovhManagerCore,
    'pascalprecht.translate',
    'ui.router',
    'ovh-api-services',
    'oui',
    'ui.bootstrap',
    'ovhManagerFilters',
    ngAtInternet,
    ngOvhDocUrl,
    ngOvhCloudUniverseComponents,
    ngUiRouterLayout,
    ngOvhUserPref,
    ovhManagerVpsAdditionnalDisk,
    ovhManagerVpsBackupStorage,
    ovhManagerVpsCloudDatabase,
    ovhManagerVpsDashboard,
    ovhManagerVpsMonitoring,
    ovhManagerVpsSecondaryDns,
    ovhManagerVpsSnapshot,
    ovhManagerVpsUpscale,
    ovhManagerVpsUpgrade,
    ovhManagerVpsVeeam,
    ovhManagerVpsWindows,
    region,
    sshKeySelector,
  ])
  .component(detailComponent.name, detailComponent)
  .component(headerComponent.name, headerComponent)
  .service('VpsTaskService', VpsTaskService)
  .service('VpsNotificationIpv6', VpsNotificationIpv6Service)
  .service('VpsService', VpsService)
  .service('VpsHelperService', VpsHelperService)
  .service('VpsUpgradeService', VpsUpgradeService)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
