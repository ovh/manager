import angular from 'angular';

import dedicatedCloudVdcOrderComponent from '../../../../components/dedicated-cloud/vmware-cloud-director/order';
import routing from './routes';

const moduleName = 'dedicatedCloudVmwareCloudDirectorOrderModule';

angular.module(moduleName, [dedicatedCloudVdcOrderComponent]).config(routing);

export default moduleName;
