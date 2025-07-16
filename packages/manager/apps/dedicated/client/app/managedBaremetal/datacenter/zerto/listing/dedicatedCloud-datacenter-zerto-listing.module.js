import angular from 'angular';

import DatacenterZertoListingComponent from '../../../../components/dedicated-cloud/datacenter/zerto/listing';
import deleteSite from './delete-site';
import routing from './dedicatedCloud-datacenter-zerto-listing.routing';

const moduleName = 'ovhManagerManagedBaremetalDatacenterZertoListingModule';

angular
  .module(moduleName, [DatacenterZertoListingComponent, deleteSite])
  .config(routing);

export default moduleName;
