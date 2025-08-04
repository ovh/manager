import angular from 'angular';

import DatacenterZertoComponent from '../../../components/dedicated-cloud/datacenter/zerto';
import onPremiseConfiguration from './configuration/onPremise';
import ovhConfiguration from './configuration/ovh';
import routing from './zerto.routing';
import summary from './summary';
import listing from './listing';
import addSite from './add-site';

const moduleName = 'managedBaremetalDatacenterZertoModule';

angular
  .module(moduleName, [
    DatacenterZertoComponent,
    onPremiseConfiguration,
    ovhConfiguration,
    summary,
    listing,
    addSite,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
