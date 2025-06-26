export default class AccountUserIdentityDocumentsController {
  /* @ngInject */
  constructor(OvhApiMeBillIceberg) {
    this.OvhApiMeBillIceberg = OvhApiMeBillIceberg;
    this.loaders = {};
  }

  $onInit() {
    if (!this.user.enterprise) {
      this.loaders.lastBill = true;
      this.OvhApiMeBillIceberg.query()
        .expand('CachedObjectList-Pages')
        .sort('date', 'DESC')
        .limit(1)
        .execute(null, true)
        .$promise.then((lastBill) => {
          this.lastBill = lastBill.data[0] || null;
        })
        .catch(() => {
          this.lastBill = null;
        })
        .finally(() => {
          this.loaders.lastBill = false;
        });
    }
  }
}
