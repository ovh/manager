import angular from 'angular';

import componentAdd from './telecom-telephony-alias-members-add.component';
import membersComponent from './telecom-telephony-alias-members.component';

import './telecom-telephony-alias-members.less';

const moduleName = 'ovhManagerTelephonyAliasMembers';

angular.module(moduleName, [])
  .run(/* @ngTranslationsInject ./translations */)
  .run(/* @ngTranslationsInject ../members */)
  .component('telecomTelephonyAliasMembers', membersComponent)
  .component('telecomTelephonyAliasMembersAdd', componentAdd);

export default moduleName;
