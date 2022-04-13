import angular from 'angular';

import progress from './progress';
import voucher from './voucher';
import featureFlippling from './feature-flipping';
import supportTicketBanner from './support-ticket-banner';

const moduleName = 'pciProjectNewComponents';

angular.module(moduleName, [
  progress,
  voucher,
  featureFlippling,
  supportTicketBanner,
]);

export default moduleName;
