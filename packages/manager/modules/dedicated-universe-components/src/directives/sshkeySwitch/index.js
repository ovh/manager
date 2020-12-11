import angular from 'angular';

import sshKeySwitchDirective from './sshkeySwitch';

const moduleName = 'ducSshkeySwitch';

angular
  .module(moduleName, [])
  .directive('ducSshkeySwitch', sshKeySwitchDirective);

export default moduleName;
