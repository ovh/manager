import angular from 'angular';

import progress from './progress';
import voucher from './voucher';
import featureFlippling from './feature-flipping';

const moduleName = 'pciProjectNewComponents';

angular
  .module(moduleName, [
    progress,
    voucher,
    featureFlippling,
  ]);

export default moduleName;
