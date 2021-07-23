import ipOrganisationService from './ip-ip-organisation.service';
import ipRange from './ip-range.service';

import agoraOrder from './agoraOrder/agoraOrder.module';
import legacyOrder from './legacyOrder/ip-ip-legacyOrder.module';

const moduleName = 'ovhManagerIpComponents';

angular
  .module(moduleName, [agoraOrder, legacyOrder])
  .service('IpOrganisation', ipOrganisationService)
  .service('IpRange', ipRange);

export default moduleName;
