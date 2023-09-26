import angular from 'angular';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';

import cpanelEolBanner from '../../../../components/cpanel-eol-banner';
import bandwidth from '../bandwidth/bandwidth.module';
import dashboard from './dashboard';
import displayName from './display-name';
import reboot from './reboot';
import install from '../install';
import interfaces from '../interfaces/interfaces.module';
import monitoring from './monitoring';
import tasks from '../tasks';
import interventions from '../intervention';
import ipmi from '../ipmi';
import orderKvm from '../kvm/order';
import netboot from '../netboot';

import bandwidthVrackOrderService from './server.bandwidth-vrack-order.service';
import component from './server.component';
import featureAvailability from './server.feature-availability';
import routing from './server.routing';
import service from './server.service';

import './server.less';

const moduleName = 'ovhManagerDedicatedServerDetail';

angular
  .module(moduleName, [
    bandwidth,
    cpanelEolBanner,
    dashboard,
    install,
    interfaces,
    'oui',
    ngOvhFeatureFlipping,
    'pascalprecht.translate',
    tasks,
    'ui.router',
    interventions,
    ipmi,
    orderKvm,
    netboot,
    displayName,
    reboot,
    monitoring,
  ])
  .component('dedicatedServer', component)
  .config(routing)
  .service('Server', service)
  .service('BandwidthVrackOrderService', bandwidthVrackOrderService)
  .service('DedicatedServerFeatureAvailability', featureAvailability)
  .constant('MITIGATION_STATUSES', {
    ACTIVATED: 'ACTIVATED',
    AUTO: 'AUTO',
    FORCED: 'FORCED',
  })
  .constant('STATISTICS_SCALE', {
    TENSECS: '_10_S',
    ONEMIN: '_1_M',
    FIVEMINS: '_5_M',
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
