import angular from 'angular';

import credit from './credit';
import challenge from './challenge';
import defaultMethod from './default';
import dlp from './dlp';
import register from './register';

const moduleName = 'pciProjectNewPaymentComponents';

angular
  .module(moduleName, [
    credit,
    challenge,
    defaultMethod,
    dlp,
    register,
  ]);

export default moduleName;
