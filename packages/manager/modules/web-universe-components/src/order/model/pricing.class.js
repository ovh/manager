import get from 'lodash/get';

/** Class represeting a catalog Pricing.
 *  For class properties, see the order.catalog.public.Pricing[]
 *  in /order/catalog/public{/productName}
 */
export default class Pricing {
  /**
   * constructor
   *
   * @param {Object} options  Class properties grouped.
   */
  constructor(options = {}) {
    Object.assign(this, options);
  }

  /**
   * isFree - Determines whether the pricing is free or not
   * @return {Boolean}
   */
  isFree() {
    return get(this, 'price') === 0;
  }
}
