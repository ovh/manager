import find from 'lodash/find';

export default class DatacenterBackupOffersCtrl {
  $onInit() {
    this.actualOffer = this.backup.backupOffer;
    if (this.backup && this.backup.backupOffer) {
      this.selectedOffer = find(this.backupOffers, {
        offerName: this.backup.backupOffer,
      });
    }
  }

  onSelected(model) {
    this.backup.backupOffer = model.offerName;
  }
}
