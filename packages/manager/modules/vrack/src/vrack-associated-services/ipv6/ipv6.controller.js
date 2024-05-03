import { POLLING_INTERVAL } from '../../dashboard/vrack.constant';

export default class VrackAssignedIpCtrl {
  /* @ngInject */
  constructor(
    $q,
    $timeout,
    CucCloudMessage,
    vrackAssignedIpv6Service,
    $translate,
    OvhApiVrack,
  ) {
    this.$q = $q;
    this.vrackAssignedIpv6Service = vrackAssignedIpv6Service;
    this.CucCloudMessage = CucCloudMessage;
    this.$translate = $translate;
    this.OvhApiVrack = OvhApiVrack;
    this.$timeout = $timeout;
    this.loading = false;
    this.subnets = [];
  }

  $onInit() {
    this.refreshData();
  }

  openAddSubnetModal() {
    this.addSubnetModalContext = {
      isOpenModal: true,
      data: {
        subnet: '',
        address: '',
      },
      onConfirm: () => {
        const {
          subnet: routedSubrange,
          address: nexthop,
        } = this.addSubnetModalContext.data;
        this.addSubnetModalContext.isOpenModal = false;
        this.CucCloudMessage.flushMessages('vrack');
        this.vrackAssignedIpv6Service
          .creatIpVrackSubnet(this.serviceName, this.ip.niceName, {
            routedSubrange,
            nexthop,
          })
          .then(({ data }) => {
            this.watingTask(data.id);
          })
          .catch((err) => {
            this.CucCloudMessage.error(
              [
                this.$translate.instant('vrack_error'),
                err?.data?.message || err.message || '',
              ].join(' '),
            );
          });
      },
      onCancel: () => {
        this.addSubnetModalContext.isOpenModal = false;
      },
    };
  }

  openDeleteSubnetModal(subnet) {
    this.deleteSubnetModalContext = {
      isOpenModal: true,
      onConfirm: () => {
        this.deleteSubnetModalContext.isOpenModal = false;
        this.CucCloudMessage.flushMessages('vrack');
        this.vrackAssignedIpv6Service
          .deleteIpVrackSubnet(this.serviceName, this.ip.niceName, subnet)
          .then(({ data }) => {
            this.watingTask(data.id);
          })
          .catch((err) => {
            this.CucCloudMessage.error(
              [
                this.$translate.instant('vrack_error'),
                err?.data?.message || err.message || '',
              ].join(' '),
            );
          });
      },
      onCancel: () => {
        this.deleteSubnetModalContext.isOpenModal = false;
      },
    };
  }

  refreshData() {
    this.vrackAssignedIpv6Service
      .getIpVrackSubnet(this.serviceName, this.ip.niceName)
      .then(({ data }) => {
        this.subnets = data;
      });
  }

  watingTask(taskId) {
    this.loader = true;
    this.OvhApiVrack.v6()
      .task({
        serviceName: this.serviceName,
        taskId,
      })
      .$promise.then(() => {
        this.$timeout(() => {
          this.watingTask(taskId);
        }, POLLING_INTERVAL);
      })
      .catch(() => {
        this.loader = false;
        this.refreshData();
      });
  }
}
