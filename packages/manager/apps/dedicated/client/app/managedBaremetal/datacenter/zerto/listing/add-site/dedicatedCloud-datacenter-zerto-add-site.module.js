import angular from 'angular';

import DatacenterZertoSiteAddSiteComponent from '../../../../../components/dedicated-cloud/datacenter/zerto/addSite';

import routing from './dedicatedCloud-datacenter-zerto-add-site.routing';

const moduleName = 'ovhManagerManagedBaremetalDatacenterZertoSiteAddSiteModule';

angular

  .module(moduleName, [DatacenterZertoSiteAddSiteComponent])

  .config(routing);

export default moduleName;
