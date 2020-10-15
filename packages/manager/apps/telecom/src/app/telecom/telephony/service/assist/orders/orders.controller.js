import map from 'lodash/map';
import set from 'lodash/set';
import snakeCase from 'lodash/snakeCase';

export default /* @ngInject */ function TelecomTelephonyServiceAssistOrdersCtrl(
  $filter,
  $q,
  $translate,
  $stateParams,
  OvhApiTelephony,
  OvhApiMeOrder,
  TelephonyMediator,
) {
  const self = this;
  self.service = null;

  /*= ==============================
  =            HELPERS            =
  =============================== */

  function fetchOrders() {
    return OvhApiTelephony.v6()
      .getCurrentOrderIds()
      .$promise.then((orderIds) =>
        OvhApiMeOrder.v7()
          .query()
          .addFilter('orderId', 'in', orderIds)
          .expand()
          .execute()
          .$promise.then((orders) =>
            $q.all(
              map(map(orders, 'value'), (order) =>
                OvhApiMeOrder.v6()
                  .getStatus({
                    orderId: order.orderId,
                  })
                  .$promise.then((status) => {
                    set(
                      order,
                      'statusText',
                      $translate.instant(
                        `telephony_line_assist_orders_order_status_${snakeCase(
                          status.status,
                        )}`,
                      ),
                    );
                    return order;
                  }),
              ),
            ),
          ),
      );
  }

  /* -----  End of HELPERS  ------*/

  /*= =====================================
  =            INITIALIZATION            =
  ====================================== */

  self.$onInit = function $onInit() {
    self.ordersRaw = null;

    return TelephonyMediator.getGroup($stateParams.billingAccount)
      .then(() => {
        self.service = TelephonyMediator.findService($stateParams.serviceName);

        return fetchOrders().then((orders) => {
          self.ordersRaw = orders;
        });
      })
      .catch(() => {
        self.ordersRaw = [];
      });
  };

  /* -----  End of INITIALIZATION  ------*/
}
