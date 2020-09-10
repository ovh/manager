import angular from 'angular';

import datacenterLicenseComponent from '../../components/dedicated-cloud/license';
import enable from './enable';
import enableLegacy from './enable-legacy';
import routing from './dedicatedCloud-license.routes';

const moduleName = 'dedicatedCloudLicenseModule';

angular
  .module(moduleName, [datacenterLicenseComponent, enable, enableLegacy])
  .config(routing);

export default moduleName;
