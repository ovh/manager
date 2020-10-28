import angular from 'angular';

import '@ovh-ux/ng-ovh-telecom-universe-components';
import modemDmz from './dmz';
import firewall from './firewall';
import wifi from './wifi';
import wifiConfig from './wifi/config';
import XdslModemDhcpBdhcp from './router/dhcp/bdhcp';
import bridgeMode from './bridgeMode';
import connectedDevices from './connectedDevices';
import firmware from './firmware';
import managedByOvh from './managedByOvh';
import mtu from './mtu';
import reboot from './reboot';
import reset from './reset';
import dhcp from './router/dhcp';
import ports from './router/ports';
import router from './router';
import lan from './router/lan';
import service from './service';

import component from './pack-xdsl-modem.component';
import { PACK_XDSL_MODEM } from './pack-xdsl-modem.constant';
import routing from './pack-xdsl-modem.routing';
import acsBackend from './acsBackend';

const moduleName = 'ovhManagerTelecomPackXdslModem';

angular
  .module(moduleName, [
    'ngOvhTelecomUniverseComponents',
    acsBackend,
    modemDmz,
    firewall,
    wifi,
    wifiConfig,
    XdslModemDhcpBdhcp,
    bridgeMode,
    connectedDevices,
    firmware,
    managedByOvh,
    mtu,
    reboot,
    reset,
    dhcp,
    ports,
    router,
    lan,
    service,
  ])
  .component('packXdslModem', component)
  .config(routing)
  .constant('PACK_XDSL_MODEM', PACK_XDSL_MODEM)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
