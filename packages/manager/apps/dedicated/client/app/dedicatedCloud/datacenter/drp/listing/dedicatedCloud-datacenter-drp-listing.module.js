import angular from 'angular';

import datacenterDrpListingComponent from '../../../../components/dedicated-cloud/datacenter/drp/listing';
import datacenterDrpDeleteSite from './delete-site';
import routing from './dedicatedCloud-datacenter-drp-listing.routing';

const moduleName = 'ovhManagerDedicatedCloudDatacenterDrpListingModule';

angular
  .module(moduleName, [datacenterDrpListingComponent, datacenterDrpDeleteSite])
  .config(routing);

export default moduleName;
