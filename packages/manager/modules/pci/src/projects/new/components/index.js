import angular from 'angular';

import progress from './progress';
import voucher from './voucher';
import featureFlippling from './feature-flipping';
import config from '../config';
import promotionBanner from './pci-new-project-promotion-banner';

const moduleName = 'pciProjectNewComponents';

angular.module(moduleName, [
  progress,
  voucher,
  featureFlippling,
  promotionBanner,
  config,
]);

export default moduleName;
