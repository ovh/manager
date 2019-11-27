import { SUBSIDIARIES } from './black-friday.constants';

export default /* @ngInject */ function (SessionService) {
  this.isAvailable = function isAvailable() {
    return SessionService.getUser().then(user => SUBSIDIARIES.includes(user.ovhSubsidiary));
  };
}
