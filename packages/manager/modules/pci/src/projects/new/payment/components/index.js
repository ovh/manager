import angular from 'angular';

import credit from './credit';
import challenge from './challenge';
import choose from './choose';
import defaultMethod from './default';
import dlp from './dlp';
import methodAdd from './add';
import register from './register';

const moduleName = 'pciProjectNewPaymentComponents';

angular.module(moduleName, [
  credit,
  challenge,
  choose,
  defaultMethod,
  dlp,
  methodAdd,
  register,
]);

export default moduleName;
