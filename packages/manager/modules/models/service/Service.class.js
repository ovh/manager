import get from 'lodash/get';
import sumBy from 'lodash/sumBy';
import Pricing from './Pricing.class';

export default class Service {
  constructor({ billing, serviceId, route, resource }, locale) {
    Object.assign(this, {
      billing,
      serviceId,
      route: route || {},
      resource,
    });

    this.locale = locale;

    this.options = [];

    this.route.url = get(route, 'url', '').replace(
      this.resource.name,
      window.encodeURIComponent(this.resource.name),
    );

    this.totalPrice = get(this.billing, 'pricing.price.value', 0);
  }

  get name() {
    return this.resource.displayName || this.resource.name;
  }

  get path() {
    return this.route.url;
  }

  get nextBillingDate() {
    return moment(this.billing.nextBillingDate).format('LL');
  }

  get engagementEndDate() {
    return (
      this.isEngaged() &&
      this.billing.engagement &&
      this.billing.engagement.endDate &&
      moment(this.billing.engagement.endDate).format('LL')
    );
  }

  get expirationDate() {
    return moment(this.billing.expirationDate).format('LL');
  }

  get productType() {
    return this.route.path
      .replace(/{.*}/, '')
      .split('/')
      .filter((item) => !!item)
      .join('_');
  }

  get monthlyPrice() {
    return this.price.monthlyPrice.text;
  }

  get price() {
    return new Pricing(
      {
        ...this.billing.pricing,
        price: {
          ...this.billing.pricing.price,
          value: this.totalPrice,
        },
      },
      this.locale,
    );
  }

  get planCode() {
    return get(this, 'billing.plan.code');
  }

  addOptions(options) {
    this.options.push(...options);
    this.totalPrice += sumBy(options, 'totalPrice');
  }

  isRenewManual() {
    return (
      this.billing &&
      this.billing.renew &&
      this.billing.renew.current &&
      this.billing.renew.current.mode === 'manual'
    );
  }

  isEngagementExpired() {
    return (
      this.isEngaged() &&
      this.billing.engagement &&
      this.billing.engagement.endDate &&
      moment(this.billing.engagement.endDate).isBefore(moment())
    );
  }

  isEngaged() {
    return (
      !!(this.billing.engagement && this.billing.engagement.endDate) ||
      !!(this.billing.pricing && this.billing.pricing.engagementConfiguration)
    );
  }
}
