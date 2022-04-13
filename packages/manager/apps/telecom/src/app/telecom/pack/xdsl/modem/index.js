import angular from 'angular';

import '@ovh-ux/ng-ovh-telecom-universe-components';
import modemDmz from './dmz';
import firewall from './firewall';
import wifi from './wifi';
import wifiConfig from './wifi/config';
import bridgeMode from './bridgeMode';
import connectedDevices from './connectedDevices';
import firmware from './firmware';
import managedByOvh from './managedByOvh';
import mtu from './mtu';
import reboot from './reboot';
import reset from './reset';
import dhcp from './router/dhcp';
import XdslModemDhcpBdhcp from './router/dhcp/bdhcp';
import ports from './router/ports';
import router from './router';
import lan from './router/lan';
import service from './service';
import XdslModemTemplates from './templates';

import component from './pack-xdsl-modem.component';
import { PACK_XDSL_MODEM } from './pack-xdsl-modem.constant';
import routing from './pack-xdsl-modem.routing';
import acsBackend from './acsBackend';

import './pack-xdsl-modem.less';

const moduleName = 'ovhManagerTelecomPackXdslModem';

angular
  .module(moduleName, [
    acsBackend,
    bridgeMode,
    connectedDevices,
    dhcp,
    firewall,
    firmware,
    lan,
    managedByOvh,
    modemDmz,
    mtu,
    'ngOvhTelecomUniverseComponents',
    ports,
    reboot,
    reset,
    router,
    service,
    wifi,
    wifiConfig,
    XdslModemDhcpBdhcp,
    XdslModemTemplates,
  ])
  .component('packXdslModem', component)
  .config(routing)
  .constant('PACK_XDSL_MODEM', PACK_XDSL_MODEM)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
