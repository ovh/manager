import angular from 'angular';

import datacenterLicenseComponent from '../../components/dedicated-cloud/license';
import enable from './enable';
import enableLegacy from './enable-legacy';
import routing from './license.routes';

const moduleName = 'managedBaremetalLicenseModule';

angular
  .module(moduleName, [datacenterLicenseComponent, enable, enableLegacy])
  .config(routing);

export default moduleName;
