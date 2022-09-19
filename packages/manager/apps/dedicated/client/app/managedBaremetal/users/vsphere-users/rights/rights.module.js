import angular from 'angular';

import edit from './edit';
import routing from './rights.routes';
import userRightsComponent from '../../../../components/dedicated-cloud/users/vsphere-users/rights';

const moduleName = 'managedBaremetalUserRightsModule';

angular
  .module(moduleName, [edit, userRightsComponent])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
