import angular from 'angular';

import vdcOrderComponent from '../../../../components/dedicated-cloud/vmware-cloud-director/order';
import routing from './routes';

const moduleName = 'managedBaremetalVmwareCloudDirectorOrderModule';

angular.module(moduleName, [vdcOrderComponent]).config(routing);

export default moduleName;
