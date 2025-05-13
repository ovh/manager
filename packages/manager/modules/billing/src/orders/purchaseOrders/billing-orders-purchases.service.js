import moment from 'moment';

import { DATE_FORMAT_MOMENT } from './billing-orders-purchases.constant';

export default class BillingOrdersPurchasesService {
  /* @ngInject */
  constructor($locale, $log, $http, iceberg) {
    this.$locale = $locale;
    this.$log = $log;
    this.$http = $http;
    this.iceberg = iceberg;
  }

  postPurchaseOrder(data) {
    return this.$http.post('/me/billing/purchaseOrder', data);
  }

  putPurchaseOrder(id, data) {
    return this.$http.put(`/me/billing/purchaseOrder/${id}`, data);
  }

  getPurchasesOrder() {
    return this.iceberg('/me/billing/purchaseOrder')
      .query()
      .expand('CachedObjectList-Pages')
      .sort('startDate', 'ASC')
      .limit(5000)
      .execute(null, true)
      .$promise.then(({ data }) => data)
      .then((purchases) =>
        purchases
          .filter((elm) => elm.status === 'CREATED')
          .map((elm) => {
            const newElm = { ...elm };
            if (
              elm.active === true &&
              (elm.endDate
                ? moment().isBetween(elm.startDate, elm.endDate, '[)') ||
                  moment().isSame(elm.startDate)
                : moment().isSameOrAfter(elm.startDate))
            ) {
              newElm.status = 'actif';
            } else if (
              elm.active === true &&
              !moment().isBetween(elm.startDate, elm.endDate, '[)')
            ) {
              newElm.status = 'inactif';
            } else {
              newElm.status = 'desactivate';
            }
            return newElm;
          }),
      );
  }

  getDisableDate(purchases) {
    this.purchases = purchases;
    return this.purchases.flatMap((elm) => {
      const array = [];
      if (elm.endDate) {
        const nbrDays = moment(elm.endDate).diff(elm.startDate, 'days');
        for (let i = 0; i < nbrDays; i += 1) {
          array.push(
            moment(elm.startDate)
              .add(i, 'day')
              .format(DATE_FORMAT_MOMENT),
          );
        }
      }
      return array;
    });
  }

  getMaxDate(purchases) {
    this.purchases = purchases;
    const arrayMaxDate = purchases.flatMap((elm) => {
      return !elm.endDate ? elm.startDate : [];
    });
    return arrayMaxDate.length > 0 ? arrayMaxDate[0] : null;
  }

  getDateFormat() {
    return this.$locale.DATETIME_FORMATS.shortDate
      .replace('dd', 'd')
      .replace('MM', 'm')
      .replace('y', 'Y');
  }

  criteria(filter) {
    if (filter) {
      try {
        const criteria = JSON.parse(decodeURIComponent(filter));
        if (!Array.isArray(criteria)) {
          throw new Error('Invalid criteria');
        }
        return criteria;
      } catch (err) {
        this.$log.error(err);
      }
    }
    return null;
  }

  minDateForEndDate() {
    this.moment = moment();
    return this.moment.add(1, 'day').format(DATE_FORMAT_MOMENT);
  }
}
