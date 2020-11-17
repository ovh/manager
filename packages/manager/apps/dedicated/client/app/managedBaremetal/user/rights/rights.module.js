import angular from 'angular';

import edit from './edit';
import routing from './rights.routes';
import userRightsComponent from '../../../components/dedicated-cloud/user/rights';

const moduleName = 'managedBaremetalUserRightsModule';

angular.module(moduleName, [edit, userRightsComponent]).config(routing);

export default moduleName;
