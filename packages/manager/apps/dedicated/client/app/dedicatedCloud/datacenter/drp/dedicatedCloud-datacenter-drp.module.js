import angular from 'angular';

import datacenterDrpComponent from '../../../components/dedicated-cloud/datacenter/drp';
import onPremiseConfiguration from './configuration/onPremise';
import ovhConfiguration from './configuration/ovh';
import routing from './dedicatedCloud-datacenter-drp.routing';
import summary from './summary';
import listing from './listing';
import addSite from './add-site';

const moduleName = 'ovhManagerDedicatedCloudDatacenterDrpModule';

angular
  .module(moduleName, [
    datacenterDrpComponent,
    onPremiseConfiguration,
    ovhConfiguration,
    summary,
    listing,
    addSite,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
