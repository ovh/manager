export default class VrackAssignedIpCtrl {
  /* @ngInject */
  constructor($q, CucCloudMessage, vrackAssignedIpService, $translate) {
    this.$q = $q;
    this.vrackAssignedIpService = vrackAssignedIpService;
    this.CucCloudMessage = CucCloudMessage;
    this.$translate = $translate;
    this.loading = false;
    this.subnets = [];
  }

  $onInit() {
    this.vrackAssignedIpService
      .getIpVrackSubnet(this.serviceName, this.ip.niceName)
      .then(({ data }) => {
        this.subnets = data;
      });

    this.openAddSubnetModal = () => {
      this.openAddModal()((subnet, address) => {
        this.CucCloudMessage.flushMessages('vrack');
        this.vrackAssignedIpService
          .creatIpVrackSubnet(this.serviceName, this.ip.niceName, {
            routedSubrange: subnet,
            nexthop: address,
          })
          .then(() => {
            this.refreshData()();
          })
          .catch((err) => {
            this.CucCloudMessage.error(
              [
                this.$translate.instant('vrack_error'),
                (err.data && err.data.message) || err.message || '',
              ].join(' '),
            );
          });
      });
    };
  }
}
