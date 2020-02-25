import map from 'lodash/map';
import set from 'lodash/set';

export default class CloudVouchersService {
  /* @ngInject */
  constructor($q, $translate, OvhApiMeBill, OvhApiCloudProjectCredit) {
    this.$q = $q;
    this.$translate = $translate;
    this.OvhApiMeBill = OvhApiMeBill;
    this.OvhApiCloudProjectCredit = OvhApiCloudProjectCredit;
  }

  futureVoucherWithPdfUrl(voucher) {
    return this.OvhApiMeBill.v6()
      .get({ billId: voucher.bill })
      .$promise.then((bill) => {
        set(voucher, 'pdfUrl', bill.pdfUrl);
        return voucher;
      })
      .catch(() => voucher);
  }

  transformItem(projectId, voucherId, offer) {
    return this.OvhApiCloudProjectCredit.v6()
      .get({
        serviceName: projectId,
        creditId: voucherId,
      })
      .$promise.then((voucher) =>
        voucher.bill ? this.futureVoucherWithPdfUrl(voucher) : voucher,
      )
      .then((voucher) => (offer ? { ...voucher, ...offer.voucher } : voucher));
  }

  getVouchers(projectId, offer) {
    return this.OvhApiCloudProjectCredit.v6()
      .query({
        serviceName: projectId,
      })
      .$promise.then((voucherIds) => {
        const promises = map(voucherIds, (id) =>
          this.transformItem(projectId, id, offer),
        );
        return this.$q.all(promises);
      });
  }

  getVoucherDisplayName(voucher) {
    if (voucher.bill) {
      return this.$translate.instant('cpb_vouchers_name_credit_provisionning');
    }
    return voucher.description;
  }
}
