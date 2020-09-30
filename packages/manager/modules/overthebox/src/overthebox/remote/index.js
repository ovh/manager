import angular from 'angular';

import component from './overTheBox-remote.component';
import constant from './overTheBox-remote.constant';
import routing from './overTheBox-remote.routing';

const moduleName = 'ovhManagerOtbRemote';

angular
  .module(moduleName, [])
  .constant('OVERTHEBOX_REMOTE_STATUS', constant)
  .component('overTheBoxRemote', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
