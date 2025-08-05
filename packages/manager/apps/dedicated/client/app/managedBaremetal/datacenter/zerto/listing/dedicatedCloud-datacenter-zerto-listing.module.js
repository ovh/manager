import angular from 'angular';

import DatacenterZertoListingComponent from '../../../../components/dedicated-cloud/datacenter/zerto/listing';
import routing from './dedicatedCloud-datacenter-zerto-listing.routing';
import DatacenterZertoAddSite from './add-site';
import deleteSite from './delete-site';

const moduleName = 'ovhManagerManagedBaremetalDatacenterZertoListingModule';

angular
  .module(moduleName, [
    DatacenterZertoListingComponent,
    DatacenterZertoAddSite,
    deleteSite,
  ])
  .config(routing);

export default moduleName;
