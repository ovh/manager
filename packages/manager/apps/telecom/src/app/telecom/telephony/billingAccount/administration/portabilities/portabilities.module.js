import angular from 'angular';

import portabilities from '../../../alias/portability/portabilities/telecom-telephony-alias-portability-portabilities.module';

import attach from './attach/portabilities-attach.module';
import deleteModule from './delete/portabilities-delete.module';

import routing from './portabilities.routing';

const moduleName = 'ovhManagerTelecomTelephonyBillingAccountPortability';

angular
  .module(moduleName, [attach, deleteModule, portabilities])
  .config(routing);

export default moduleName;
