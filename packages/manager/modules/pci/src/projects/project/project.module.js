import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-api-wrappers'; // should be a peer dependency of ovh-api-services
import 'angular-translate';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import analyticsDataPlatform from './analytics-data-platform';
import baremetal from './baremetal';
import billing from './billing';
import contacts from './contacts';
import creating from './creating';
import dataProcessing from './data-processing';
import edit from './edit';
import failoverIps from './failover-ips';
import instances from './instances';
import kubernetes from './kubernetes';
import loadBalancer from './load-balancer';
import sshKeys from './ssh-keys';
import privateNetworks from './private-networks';
import quota from './quota';
import privateRegistry from './private-registry';
import sidebar from './sidebar';
import storages from './storages';
import users from './users';
import vouchers from './vouchers';
import regions from './regions';
import routing from './project.routing';
import streams from './streams';
import serving from './serving';
import workflow from './workflow';

import './project.less';

const moduleName = 'ovhManagerPciProject';

angular
  .module(moduleName, [
    analyticsDataPlatform,
    baremetal,
    billing,
    contacts,
    creating,
    dataProcessing,
    edit,
    failoverIps,
    instances,
    loadBalancer,
    kubernetes,
    privateNetworks,
    quota,
    regions,
    privateRegistry,
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    sshKeys,
    sidebar,
    storages,
    users,
    vouchers,
    streams,
    workflow,
    serving,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
