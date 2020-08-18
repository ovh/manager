import angular from 'angular';

import addPopConfiguration from './add-pop-configuration';
import associateVrack from './associate-vrack';
import component from './overview.component';
import datacenterAdd from './datacenter/add';
import datacenterAddExtra from './datacenter/add-extra';
import datacenterConfiguration from './components/datacenter-configuration';
import datacenterExtraConfiguration from './components/datacenter-extra';
import datacenterRemoveExtra from './datacenter/remove-extra';
import editDescription from './edit-description';
import lockPort from './lock-port';
import removeDatacenterConfiguration from './datacenter/remove-datacenter';
import removePopConfiguration from './remove-pop-configuration';
import removeVrack from './remove-vrack';
import routing from './overview.routing';
import sendServiceKey from './send-service-key';
import unlockPort from './unlock-port';

const moduleName = 'ovhCloudConnectDetailsOverview';

angular
  .module(moduleName, [
    addPopConfiguration,
    associateVrack,
    datacenterAdd,
    datacenterAddExtra,
    datacenterConfiguration,
    datacenterExtraConfiguration,
    datacenterRemoveExtra,
    editDescription,
    lockPort,
    removeDatacenterConfiguration,
    removePopConfiguration,
    removeVrack,
    unlockPort,
    sendServiceKey,
  ])
  .config(routing)
  .component('cloudConnectDetailsOverview', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
