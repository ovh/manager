import angular from 'angular';

import datacenterDrpListingComponent from '../../../../components/dedicated-cloud/datacenter/drp/listing';
import deleteSite from './delete-site';
import routing from './dedicatedCloud-datacenter-drp-listing.routing';

const moduleName = 'ovhManagerManagedBaremetalDatacenterDrpListingModule';

angular
  .module(moduleName, [datacenterDrpListingComponent, deleteSite])
  .config(routing);

export default moduleName;
