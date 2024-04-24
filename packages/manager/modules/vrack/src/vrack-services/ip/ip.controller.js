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
    const parentCallBack = this.refreshData();
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
            parentCallBack();
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

    this.openDeleteSubnetModal = (subnet) => {
      this.openDeleteModal()(() => {
        this.CucCloudMessage.flushMessages('vrack');
        this.vrackAssignedIpService
          .deleteIpVrackSubnet(this.serviceName, this.ip.niceName, subnet)
          .then(() => {
            parentCallBack();
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
