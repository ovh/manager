import angular from 'angular';

import add from './add';
import datacentersComponent from '../../components/dedicated-cloud/datacenters';
import routing from './dedicatedCloud-datacenters.routes';

const moduleName = 'ovhManagerDedicatedCloudDatacenters';

angular.module(moduleName, [add, datacentersComponent]).config(routing);

export default moduleName;
