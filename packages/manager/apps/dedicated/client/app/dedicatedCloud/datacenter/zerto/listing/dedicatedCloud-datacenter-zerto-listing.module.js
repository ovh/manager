import angular from 'angular';

import DatacenterZertoListingComponent from '../../../../components/dedicated-cloud/datacenter/zerto/listing';
import DatacenterZertoDeleteSite from './delete-site';
import routing from './dedicatedCloud-datacenter-zerto-listing.routing';

const moduleName = 'ovhManagerDedicatedCloudDatacenterZertoListingModule';

angular
  .module(moduleName, [
    DatacenterZertoListingComponent,
    DatacenterZertoDeleteSite,
  ])
  .config(routing);

export default moduleName;
