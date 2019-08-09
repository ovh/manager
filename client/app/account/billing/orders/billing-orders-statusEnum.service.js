angular.module('Billing.services').service('BillingOrderStatusEnum', function (BillingApiSchema, $q) {
  let orderStatusEnum;

  this.getEnum = function () {
    if (orderStatusEnum) {
      return $q.when(orderStatusEnum);
    }

    return BillingApiSchema.getSchema('me').then((schema) => {
      orderStatusEnum = _.chain(schema.models['billing.order.OrderStatusEnum'].enum)
        .map((status) => {
          const key = _.snakeCase(status).toUpperCase();
          return [key, status];
        })
        .zipObject()
        .value();
      return orderStatusEnum;
    });
  };
});
