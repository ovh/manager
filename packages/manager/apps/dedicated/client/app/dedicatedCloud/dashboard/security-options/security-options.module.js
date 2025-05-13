import angular from 'angular';

import securityOptionsComponent from '../../../components/dedicated-cloud/security-options';
import routing from './security-options.routing';

const moduleName = 'dedicatedCloudDashboardSecurityOptionsModule';

angular.module(moduleName, [securityOptionsComponent]).config(routing);

export default moduleName;
