import fromPairs from 'lodash/fromPairs';
import map from 'lodash/map';

import snakeCase from 'lodash/snakeCase';

export default /* @ngInject */ function BillingOrderStatusEnum(
  BillingApiSchema,
  $q,
) {
  let orderStatusEnum;

  this.getEnum = function getEnum() {
    if (orderStatusEnum) {
      return $q.when(orderStatusEnum);
    }

    return BillingApiSchema.getSchema('me').then((schema) => {
      orderStatusEnum = fromPairs(
        map(schema.models['billing.order.OrderStatusEnum'].enum, (status) => {
          const key = snakeCase(status).toUpperCase();
          return [key, status];
        }),
      );
      return orderStatusEnum;
    });
  };
}
