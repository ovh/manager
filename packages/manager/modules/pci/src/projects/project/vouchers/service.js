import set from 'lodash/set';

export default class CloudVouchersService {
  /* @ngInject */
  constructor($q, $translate, iceberg, OvhApiMeBill) {
    this.$q = $q;
    this.$translate = $translate;
    this.iceberg = iceberg;
    this.OvhApiMeBill = OvhApiMeBill;
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

  getVouchers(projectId, offer) {
    return this.iceberg('/cloud/project/:serviceName/credit')
      .query()
      .expand('CachedObjectList-Pages')
      .sort('id', 'DESC')
      .execute({ serviceName: projectId })
      .$promise.then(({ data }) => data)
      .then((vouchers) => {
        const promises = vouchers.map((voucher) =>
          voucher.bill ? this.futureVoucherWithPdfUrl(voucher) : voucher,
        );
        return this.$q
          .all(promises)
          .then(() =>
            vouchers.map((voucher) =>
              offer ? { ...voucher, ...offer.voucher } : voucher,
            ),
          );
      });
  }

  getVoucherDisplayName(voucher) {
    if (voucher.bill) {
      return this.$translate.instant('cpb_vouchers_name_credit_provisionning');
    }
    return voucher.description;
  }
}
