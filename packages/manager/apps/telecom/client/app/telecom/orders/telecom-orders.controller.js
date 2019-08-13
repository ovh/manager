angular.module('managerApp').controller('TelecomOrdersCtrl', function (OvhApiXdslOrderFollowup, TucToastError, ORDER_STATUS, PAGINATION_PER_PAGE) {
  const self = this;

  self.ordersDetails = null;
  self.orders = [];
  self.perPage = PAGINATION_PER_PAGE;

  /*= =====================================
  =            INITIALIZATION            =
  ====================================== */

  self.$onInit = function () {
    OvhApiXdslOrderFollowup.Aapi().query().$promise.then((result) => {
      self.orders = result;

      result.forEach((access) => {
        if (access.lastTask) {
          _.set(access, 'badgeClass', ORDER_STATUS[access.lastTask.status].class);
          _.set(access, 'badgeIconClass', ORDER_STATUS[access.lastTask.status].icon);
          _.set(access, 'priority', ORDER_STATUS[access.lastTask.status].priority);
        }
        _.set(access, 'name', access.description ? access.description : access.xdsl);
      });

      // sort: first ERROR, then TODO, then DOING, then DONE
      self.orders = _.sortByOrder(self.orders, ['priority'], ['desc']);
      self.ordersDetails = self.orders;
    }, err => new TucToastError(err));
  };

  /* -----  End of INITIALIZATION  ------*/
});
