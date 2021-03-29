import orderBy from 'lodash/orderBy';
import set from 'lodash/set';

angular
  .module('managerApp')
  .controller(
    'TelecomOrdersCtrl',
    function TelecomOrdersCtrl(
      OvhApiXdslOrderFollowup,
      TucToastError,
      ORDER_STATUS,
      PAGINATION_PER_PAGE,
    ) {
      const self = this;

      self.ordersDetails = null;
      self.orders = [];
      self.perPage = PAGINATION_PER_PAGE;

      /*= =====================================
  =            INITIALIZATION            =
  ====================================== */

      self.$onInit = function $onInit() {
        OvhApiXdslOrderFollowup.Aapi()
          .query()
          .$promise.then(
            (result) => {
              self.orders = result;

              result.forEach((access) => {
                if (access.lastTask) {
                  set(
                    access,
                    'badgeClass',
                    ORDER_STATUS[access.lastTask.status].class,
                  );
                  set(
                    access,
                    'badgeIconClass',
                    ORDER_STATUS[access.lastTask.status].icon,
                  );
                  set(
                    access,
                    'priority',
                    ORDER_STATUS[access.lastTask.status].priority,
                  );
                }
                set(
                  access,
                  'name',
                  access.description ? access.description : access.xdsl,
                );
              });

              // sort: first ERROR, then TODO, then DOING, then DONE
              self.orders = orderBy(self.orders, ['priority'], ['desc']);
              self.ordersDetails = self.orders;
            },
            (err) => new TucToastError(err),
          );
      };

      /* -----  End of INITIALIZATION  ------*/
    },
  );
