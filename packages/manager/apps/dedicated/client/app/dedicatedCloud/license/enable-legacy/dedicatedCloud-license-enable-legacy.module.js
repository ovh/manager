import angular from 'angular';

import datacenterLicenseEnableLegacyComponent from '../../../components/dedicated-cloud/license/enable/legacy';
import routing from './dedicatedCloud-license-enable-legacy.routes';

const moduleName = 'dedicatedCloudLicenseEnableLegacyModule';

angular
  .module(moduleName, [datacenterLicenseEnableLegacyComponent])
  .config(routing);

export default moduleName;
