import angular from 'angular';

import credit from './credit';
import challenge from './challenge';
import challengeIndia from './challenge-india';
import choose from './choose';
import defaultMethod from './default';
import dlp from './dlp';
import methodAdd from './add';
import register from './register';

const moduleName = 'pciProjectNewPaymentComponents';

angular.module(moduleName, [
  credit,
  challenge,
  challengeIndia,
  choose,
  defaultMethod,
  dlp,
  methodAdd,
  register,
]);

export default moduleName;
