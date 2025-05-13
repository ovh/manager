angular
  .module('managerApp')
  .service('TelecomMediator', function TelecomMediator($q, OvhApiMeVipStatus) {
    const self = this;

    self.isVip = false;
    self.serviceCount = null;

    self.deferred = {
      vip: null,
      count: null,
    };

    /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

    /* ----------  VIP STATUS  ----------*/

    self.initVipStatus = function initVipStatus(force) {
      if (self.deferred.vip && !force) {
        return self.deferred.vip.promise;
      }

      self.deferred.vip = $q.defer();

      // get vip status of connected user
      OvhApiMeVipStatus.v6()
        .get()
        .$promise.then((vipStatus) => {
          self.isVip = vipStatus.telecom;
          self.deferred.vip.resolve(self.isVip);
        });

      return self.deferred.vip.promise;
    };

    /* -----  End of INITIALIZATION  ------*/
  });
