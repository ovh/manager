import angular from 'angular';

import DatacenterZertoListingComponent from '../../../../components/dedicated-cloud/datacenter/zerto/listing';
import DatacenterZertoDeleteSite from './delete-site';
import DatacenterZertoAddSite from './add-site';
import routing from './dedicatedCloud-datacenter-zerto-listing.routing';

const moduleName = 'ovhManagerDedicatedCloudDatacenterZertoListingModule';

angular
  .module(moduleName, [
    DatacenterZertoListingComponent,
    DatacenterZertoDeleteSite,
    DatacenterZertoAddSite,
  ])
  .config(routing);

export default moduleName;
