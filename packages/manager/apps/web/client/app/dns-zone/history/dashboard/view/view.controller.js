export default class ViewDnsZoneController {
  $onInit() {
    this.dnsZoneData = null;
    this.loadingDnsZoneData = true;

    this.getDnsZoneData(this.url)
      .then((res) => {
        this.dnsZoneData = res;
      })
      .catch(() => {
        this.goBack();
      })
      .finally(() => {
        this.loadingDnsZoneData = false;
      });
  }

  openDnsRestoreModal() {
    this.goToDnsRestore(this.url, this.creationDate);
  }
}
