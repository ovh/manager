import angular from 'angular';

import add from './add';
import datacentersComponent from '../../components/dedicated-cloud/datacenters';
import routing from './datacenters.routes';

const moduleName = 'managedBaremetalDatacenters';

angular.module(moduleName, [add, datacentersComponent]).config(routing);

export default moduleName;
