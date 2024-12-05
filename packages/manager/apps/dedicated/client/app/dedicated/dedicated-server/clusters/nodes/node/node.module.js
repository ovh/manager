import angular from 'angular';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';

import { serverMainPage } from '@ovh-ux/manager-bm-server-components';

import cpanelEolBanner from '../../../../../components/cpanel-eol-banner';
import bandwidth from '../bandwidth/bandwidth.module';
import dashboard from './dashboard';
import secondaryDns from './secondary-dns';
import displayName from './display-name';
import reboot from './reboot';
import interfaces from '../interfaces/interfaces.module';
import monitoring from './monitoring';
import reverseDnsUpdate from './reverse-dns/update';
import reverseDnsDelete from './reverse-dns/delete';
import ftpBackupStorage from '../ftp-backup';
import tasks from '../tasks';
import interventions from '../intervention';
import ipmi from '../ipmi';
import netboot from '../netboot';
import tags from '../tags';
import trafficOrder from './traffic/order';
import trafficCancel from './traffic/cancel';
import trafficService from './traffic/traffic.service';
import routing from './node.routing';

const moduleName = 'ovhManagerDedicatedClusterNodeDetail';

angular
  .module(moduleName, [
    serverMainPage,
    bandwidth,
    cpanelEolBanner,
    dashboard,
    secondaryDns,
    interfaces,
    ftpBackupStorage,
    'oui',
    ngOvhFeatureFlipping,
    'pascalprecht.translate',
    tasks,
    'ui.router',
    interventions,
    ipmi,
    netboot,
    tags,
    displayName,
    reboot,
    monitoring,
    reverseDnsUpdate,
    reverseDnsDelete,
    trafficOrder,
    trafficCancel,
    trafficService,
  ])
  .config(routing)
  .config(
    /* @ngInject */ (atInternetUiRouterPluginProvider) => {
      atInternetUiRouterPluginProvider.addStateNameFilter((stateName) => {
        return stateName.replace(
          'dedicated::dedicated-cluster::cluster::node',
          'dedicated::dedicated-server::node',
        );
      });
    },
  )
  .service('ServerTrafficService', trafficService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
