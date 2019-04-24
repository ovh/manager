import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-api-wrappers'; // should be a peer dependency of ovh-api-services
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import billing from './billing';
import contacts from './contacts';
import edit from './edit';
import failoverIps from './failover-ips';
import instances from './instances';
import kubernetes from './kubernetes';
import legacy from './legacy';
import sshKeys from './ssh-keys';
import privateNetworks from './private-networks';
import storages from './storages';
import vouchers from './vouchers';
import routing from './project.routing';

const moduleName = 'ovhManagerPciProject';

angular
  .module(moduleName, [
    billing,
    contacts,
    edit,
    failoverIps,
    instances,
    kubernetes,
    legacy,
    privateNetworks,
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    sshKeys,
    storages,
    vouchers,
  ])
  .config(routing);

export default moduleName;
