import angular from 'angular';

import datacenterLicenseEnableComponent from '../../../components/dedicated-cloud/license/enable';
import routing from './enable.routes';

const moduleName = 'managedBaremetalLicenseEnableModule';

angular.module(moduleName, [datacenterLicenseEnableComponent]).config(routing);

export default moduleName;
