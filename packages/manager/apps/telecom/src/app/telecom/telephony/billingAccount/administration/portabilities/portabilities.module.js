import angular from 'angular';

import portabilities from '../../../alias/portability/portabilities/portabilities.module';

import attach from './attach/portabilities-attach.module';
import deleteModule from './delete/portabilities-delete.module';
import cancelModule from './cancel/portabilities-cancel.module';

import routing from './portabilities.routing';

const moduleName = 'ovhManagerTelecomTelephonyBillingAccountPortability';

angular
  .module(moduleName, [attach, cancelModule, deleteModule, portabilities])
  .config(routing);

export default moduleName;
