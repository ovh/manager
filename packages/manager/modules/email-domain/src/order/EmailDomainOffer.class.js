import find from 'lodash/find';
import get from 'lodash/get';
import includes from 'lodash/includes';
import startCase from 'lodash/startCase';
import trimStart from 'lodash/trimStart';

export default class EmailDomainOffer {
  constructor({ planCode, prices, productName, productType }) {
    Object.assign(this, {
      planCode,
      prices,
      productName,
      productType,
    });
  }

  getPrice(capacity) {
    return get(
      find(this.prices, ({ capacities }) => includes(capacities, capacity)),
      'priceInUcents',
    );
  }

  get displayName() {
    const [prefix, offer] = this.planCode.split('_');
    return `${prefix.toUpperCase()} ${startCase(trimStart(offer, '0'))}`;
  }
}
