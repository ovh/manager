import angular from 'angular';

import datacenterSecurityDeleteComponent from '../../../components/dedicated-cloud/security/delete';
import routing from './delete.routing';

const moduleName = 'managedBaremetalSecurityDelete';

angular.module(moduleName, [datacenterSecurityDeleteComponent]).config(routing);

export default moduleName;
