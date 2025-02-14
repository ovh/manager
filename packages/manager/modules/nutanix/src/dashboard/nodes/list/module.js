import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import { region, iamProtectedData } from '@ovh-ux/manager-components';

import routing from './routing';
import component from './component';
import datacenterName from '../../component/datacenter-name/module';
import nodeStatus from '../../component/node-os-datagrid/module';
import nodeOsDatagrid from '../../component/service-status/module';
import nodeActionMenu from '../../component/node-action-menu/module';
import nodeActionMenuTerminated from '../../component/node-action-menu-terminated/module';
import addNodes from './add-nodes';
import poweroffNode from './poweroff-node';
import installNode from './install-node';
import reinstallNode from './reinstall-node';
import uninstallNode from './uninstall-node';
import resiliateNode from './resiliate-node';

const moduleName = 'ovhManagerNutanixAllNodes';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'ui.router',
    region,
    datacenterName,
    iamProtectedData,
    nodeStatus,
    nodeOsDatagrid,
    nodeActionMenu,
    nodeActionMenuTerminated,
    addNodes,
    poweroffNode,
    installNode,
    reinstallNode,
    uninstallNode,
    resiliateNode,
  ])
  .config(routing)
  .component('nutanixAllNodes', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
