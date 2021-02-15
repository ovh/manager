import IPv4 from './IPv4.class';

export default class KubernetesRestrictionsCtrl {
  /* @ngInject */
  constructor($translate, CucCloudMessage) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
  }

  $onInit() {
    this.loadMessages();
    this.getIps(this.restrictions);
    this.selectRow(this.ips.length);
    this.currentIp = null;
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(
      'pci.projects.project.kubernetes.details.restrictions',
    );
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.kubernetes.details.restrictions',
      { onMessage: () => this.refreshMessages() },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  getIps(restrictions) {
    this.ips = restrictions.map((ip) => new IPv4(ip));
  }

  selectRow(index) {
    this.currentEditedRow = index;
  }

  cancelRestriction(index) {
    if (!this.ips[index].address) {
      this.editRestriction(index);
    } else {
      this.selectRow(this.ips.length);
    }
  }

  addRestriction() {
    this.currentIp = null;
    this.ips.push({});
    this.selectRow(this.ips.length - 1);
  }

  editRestriction(rowIndex) {
    this.selectRow(rowIndex);
    this.currentIp = this.ips[rowIndex].address;
    if (!this.ips[this.ips.length - 1].address) {
      this.ips.pop();
    }
  }

  deleteIp(ip, index) {
    this.isLoading = true;
    return this.deleteRestriction(ip.address)
      .then(() => {
        this.ips.splice(index, 1);
        return this.CucCloudMessage.success(
          this.$translate.instant('kube_restrictions_add_success'),
        );
      })
      .catch(
        (error) =>
          `${this.CucCloudMessage.error(
            this.$translate.instant('kube_restrictions_add_error'),
          )}${error.data}`,
      )
      .finally(() => {
        this.isLoading = false;
      });
  }

  saveRestrictions(index) {
    this.isLoading = true;
    this.ips[index] = new IPv4(this.currentIp);
    this.selectRow(this.ips.length);
    return this.updateRestrictions(this.ips.map((ip) => ip.format()))
      .then((restrictions) => {
        this.getIps(restrictions);
        return this.CucCloudMessage.success(
          this.$translate.instant('kube_restrictions_add_success'),
        );
      })
      .catch(
        (error) =>
          `${this.CucCloudMessage.error(
            this.$translate.instant('kube_restrictions_add_error'),
          )}${error.data}`,
      )
      .finally(() => {
        this.isLoading = false;
      });
  }

  isIPValid() {
    try {
      const [cidr, mask] = this.currentIp.split('/');
      const splittedCidr = cidr.split('.');
      if (splittedCidr.length !== 4) {
        return false;
      }
      if (mask || mask === '') {
        splittedCidr.push(mask);
      }
      return splittedCidr.every(
        (value) => parseInt(value, 10) >= 0 && parseInt(value, 10) < 256,
      );
    } catch (error) {
      return false;
    }
  }
}
