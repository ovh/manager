export default class BillingOrdersPurchasesService {
  /* @ngInject */
  constructor($locale, $log, $q, OvhHttp, iceberg) {
    this.$locale = $locale;
    this.$log = $log;
    this.$q = $q;
    this.OvhHttp = OvhHttp;
    this.iceberg = iceberg;
  }

  postPurchaseOrder(data) {
    return this.OvhHttp.post('/me/billing/purchaseOrder', {
      rootPath: 'apiv6',
      data,
    });
  }

  putPurchaseOrder(id, data) {
    return this.OvhHttp.put(`/me/billing/purchaseOrder/${id}`, {
      rootPath: 'apiv6',
      data,
    });
  }

  getPurchasesOrder() {
    return this.iceberg('/me/billing/purchaseOrder')
      .query()
      .expand('CachedObjectList-Pages')
      .sort('reference', 'ASC')
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
              this.toDay >= elm.startDate &&
              this.toDay <= elm.endDate
            ) {
              newElm.status = 'actif';
            } else if (
              elm.active === true &&
              !(this.toDay >= elm.startDate && this.toDay <= elm.endDate)
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
      const nbrDays =
        (new Date(elm.endDate).getTime() - new Date(elm.startDate).getTime()) /
        86400000;
      const array = [];
      for (let i = 0; i < nbrDays; i += 1) {
        const date = new Date(elm.startDate);
        date.setDate(date.getDate() + i);
        array.push(date);
      }
      return array;
    });
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
    return undefined;
  }

  minDateForEndDate() {
    this.date = new Date();
    return this.date.setDate(this.date.getDate() + 1);
  }

  static toDay() {
    return new Date()
      .toISOString()
      .slice(0, new Date().toISOString().indexOf('T'));
  }
}
