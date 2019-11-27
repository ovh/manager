import { SUBSIDIARIES, LEGAL_NOTICE } from './black-friday.constants';

export default /* @ngInject */ function (SessionService) {
  this.isAvailable = function isAvailable() {
    return SessionService.getUser().then(user => SUBSIDIARIES.includes(user.ovhSubsidiary));
  };

  this.getLegalNotice = function getLegalNotice() {
    return SessionService.getUser().then(user => LEGAL_NOTICE[user.ovhSubsidiary]);
  };
}
