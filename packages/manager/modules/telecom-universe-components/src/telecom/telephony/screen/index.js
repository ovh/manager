import angular from 'angular';

import 'ovh-api-services';

import TucVoipScreenScreenList from './screenList/telephony-screen-list.factory';

const moduleName = 'tucTelecomTelephonyScreen';

angular
  .module(moduleName, ['ovh-api-services'])
  .factory('TucVoipScreenScreenList', TucVoipScreenScreenList);

export default moduleName;
