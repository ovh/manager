import angular from 'angular';

import datacenterSecurityUpdateComponent from '../../../components/dedicated-cloud/security/update';
import routing from './update.routing';

const moduleName = 'managedBaremetalSecurityUpdate';

angular.module(moduleName, [datacenterSecurityUpdateComponent]).config(routing);

export default moduleName;
