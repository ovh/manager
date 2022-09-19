import angular from 'angular';

import edit from './edit';
import routing from './vsphere-user-rights.routes';
import userRightsComponent from '../../../../components/dedicated-cloud/users/vsphere-users/rights';

const moduleName = 'dedicatedCloudVsphereUserRightsModule';

angular
  .module(moduleName, [edit, userRightsComponent])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
