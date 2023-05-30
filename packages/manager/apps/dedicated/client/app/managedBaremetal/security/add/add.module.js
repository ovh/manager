import angular from 'angular';

import datacenterSecurityAddComponent from '../../../components/dedicated-cloud/security/add';
import routing from './add.routing';

const moduleName = 'managedBaremetalSecurityAdd';

angular.module(moduleName, [datacenterSecurityAddComponent]).config(routing);

export default moduleName;
