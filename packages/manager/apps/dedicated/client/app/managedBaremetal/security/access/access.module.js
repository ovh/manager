import angular from 'angular';

import datacenterSecurityAccessComponent from '../../../components/dedicated-cloud/security/access';
import routing from './access.routing';

const moduleName = 'managedBaremetalSecurityAccess';

angular.module(moduleName, [datacenterSecurityAccessComponent]).config(routing);

export default moduleName;
