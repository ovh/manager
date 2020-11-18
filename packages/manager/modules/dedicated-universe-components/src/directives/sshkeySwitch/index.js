import angular from 'angular';

import sshKeySwitchDirective from './sshkeySwitch';
import './sshkeySwitch.css';

const moduleName = 'ducSshkeySwitch';

angular.module(moduleName, []).directive('sshkeySwitch', sshKeySwitchDirective);

export default moduleName;
