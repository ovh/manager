import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';
import { region, iamProtectedData } from '@ovh-ux/manager-components';

import routing from './routing';
import component from './component';
import datacenterName from '../../component/datacenter-name/module';
import nodeStatus from '../../component/node-os-datagrid/module';
import nodeOsDatagrid from '../../component/service-status/module';
import addNodes from './add-nodes';
import poweronNode from './poweron-node';
import poweroffNode from './poweroff-node';
import installNode from './install-node';
import uninstallNode from './uninstall-node';
import resiliateNode from './resiliate-node';

const moduleName = 'ovhManagerNutanixAllNodes';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    region,
    datacenterName,
    iamProtectedData,
    nodeStatus,
    nodeOsDatagrid,
    addNodes,
    poweronNode,
    poweroffNode,
    installNode,
    uninstallNode,
    resiliateNode,
  ])
  .config(routing)
  .component('nutanixAllNodes', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
