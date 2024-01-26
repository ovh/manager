import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-api-wrappers'; // should be a peer dependency of ovh-api-services
import 'angular-translate';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';
import ovhManagerAdvices from '@ovh-ux/manager-advices';
import trustedNic from '@ovh-ux/manager-trusted-nic';

import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import billing from './billing';
import contacts from './contacts';
import creating from './creating';
import dataProcessing from './data-processing';
import edit from './edit';
import activate from './activate';
import components from './components';
import additionalIps from './additional-ips';
import inactive from './inactive';
import instances from './instances';
import kubernetes from './kubernetes';
import loadBalancer from './load-balancer';
import notebooks from './notebooks';
import ai from './ai';
import sshKeys from './ssh-keys';
import privateNetworks from './private-networks';
import quota from './quota';
import quotaExceedError from './quota-exceed-error';
import privateRegistry from './private-registry';
import storages from './storages';
import users from './users';
import vouchers from './vouchers';
import regions from './regions';
import routing from './project.routing';
import training from './training';
import workflow from './workflow';
import pciAnnouncementBanner from '../../components/pci-announcement-banner';
import pciMaintenanceBanner from '../../components/pci-maintenance-banner';
import aiDashboard from './ai-dashboard';
import projectComponent from './project.component';
import service from './project.service';
import pciProjectNew from '../new/service';
import orderCart from '../order-cart.service';
import gateways from './gateways';

import './project.less';

const moduleName = 'ovhManagerPciProject';

angular
  .module(moduleName, [
    ovhManagerAdvices,
    trustedNic,
    billing,
    contacts,
    creating,
    dataProcessing,
    edit,
    activate,
    components,
    additionalIps,
    inactive,
    instances,
    loadBalancer,
    notebooks,
    ai,
    kubernetes,
    privateNetworks,
    quota,
    quotaExceedError,
    regions,
    privateRegistry,
    ngOvhUtils,
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    sshKeys,
    storages,
    users,
    vouchers,
    workflow,
    training,
    pciAnnouncementBanner,
    pciMaintenanceBanner,
    gateways,
    aiDashboard,
  ])
  .config(routing)
  .component('pciProject', projectComponent)
  .run(/* @ngTranslationsInject:json ./translations */)
  .service('orderCart', orderCart)
  .service('pciProjectNew', pciProjectNew)
  .service('PciProject', service);

export default moduleName;
