import angular from 'angular';

import datacenterDrpComponent from '../../../components/dedicated-cloud/datacenter/drp';
import onPremiseConfiguration from './configuration/onPremise';
import ovhConfiguration from './configuration/ovh';
import routing from './drp.routing';
import summary from './summary';

const moduleName = 'managedBaremetalDatacenterDrpModule';

angular
  .module(moduleName, [
    datacenterDrpComponent,
    onPremiseConfiguration,
    ovhConfiguration,
    summary,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
