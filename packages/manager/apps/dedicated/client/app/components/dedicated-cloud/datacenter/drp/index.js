import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';

import {
  DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS,
  DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS,
  DEDICATEDCLOUD_DATACENTER_DRP_ROLES,
  DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
  DEDICATEDCLOUD_DATACENTER_DRP_UNAVAILABLE_IP_STATUS,
  DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS,
  DEDICATEDCLOUD_DATACENTER_ZERTO,
} from './dedicatedCloud-datacenter-drp.constants';

import drpAlerts from './alerts';
import drpService from './dedicatedCloud-datacenter-drp.service';
import component from './dedicatedCloud-datacenter-drp.component';
import onPremiseTypeConfiguration from './configuration/onPremise';
import ovhTypeConfiguration from './configuration/ovh';
import summary from './summary';

const moduleName = 'dedicatedCloudDatacenterDrp';

const optionsConstantName = 'DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS';
const orderOptionsConstantName = 'DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS';
const rolesConstantName = 'DEDICATEDCLOUD_DATACENTER_DRP_ROLES';
const statusConstantName = 'DEDICATEDCLOUD_DATACENTER_DRP_STATUS';
const unavailableIpStatusConstantName =
  'DEDICATEDCLOUD_DATACENTER_DRP_UNAVAILABLE_IP_STATUS';
const vpnConfigurationStatusConstantName =
  'DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS';
const zertoConstantName = 'DEDICATEDCLOUD_DATACENTER_ZERTO';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    drpAlerts,
    drpService,
    onPremiseTypeConfiguration,
    ovhTypeConfiguration,
    summary,
  ])
  .component(component.name, component)
  .constant(optionsConstantName, DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS)
  .constant(
    orderOptionsConstantName,
    DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS,
  )
  .constant(rolesConstantName, DEDICATEDCLOUD_DATACENTER_DRP_ROLES)
  .constant(statusConstantName, DEDICATEDCLOUD_DATACENTER_DRP_STATUS)
  .constant(
    unavailableIpStatusConstantName,
    DEDICATEDCLOUD_DATACENTER_DRP_UNAVAILABLE_IP_STATUS,
  )
  .constant(
    vpnConfigurationStatusConstantName,
    DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS,
  )
  .constant(zertoConstantName, DEDICATEDCLOUD_DATACENTER_ZERTO)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
