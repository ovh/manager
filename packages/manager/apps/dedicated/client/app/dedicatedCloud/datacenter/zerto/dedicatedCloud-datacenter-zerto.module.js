import angular from 'angular';

import DatacenterZertoComponent from '../../../components/dedicated-cloud/datacenter/zerto';
import onPremiseConfiguration from './configuration/onPremise';
import ovhConfiguration from './configuration/ovh';
import routing from './dedicatedCloud-datacenter-zerto.routing';
import summary from './summary';
import listing from './listing';
import drp from './drp';

const moduleName = 'ovhManagerDedicatedCloudDatacenterZertoModule';

angular
  .module(moduleName, [
    DatacenterZertoComponent,
    onPremiseConfiguration,
    ovhConfiguration,
    summary,
    listing,
    drp,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
