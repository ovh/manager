import {
  POLLING_INTERVAL,
  SLAAC_VALUES,
  VRACK_DASHBOARD_TRACKING_PREFIX,
  VRACK_ACTIONS_SUFFIX,
} from '../../dashboard/vrack.constant';
import { SLAAC_LABEL, IPV6_GUIDES_LINK } from './ipv6.constant';

export default class VrackAssignedIpCtrl {
  /* @ngInject */
  constructor(
    $q,
    $timeout,
    CucCloudMessage,
    vrackAssignedIpv6Service,
    $translate,
    atInternet,
    OvhApiVrack,
    coreConfig,
  ) {
    this.$q = $q;
    this.vrackAssignedIpv6Service = vrackAssignedIpv6Service;
    this.CucCloudMessage = CucCloudMessage;
    this.$translate = $translate;
    this.OvhApiVrack = OvhApiVrack;
    this.$timeout = $timeout;
    this.loading = false;
    this.subnets = [];
    this.atInternet = atInternet;
    this.user = coreConfig.getUser();
    this.slaacGuidesLink =
      IPV6_GUIDES_LINK[this.user.ovhSubsidiary] || IPV6_GUIDES_LINK.DEFAULT;
    this.label = { SLAAC: SLAAC_LABEL };
  }

  $onInit() {
    this.vrackAssignedIpv6Service
      .fetchAllBridgedSubrange(this.serviceName, this.ip.niceName)
      .then(({ data }) => {
        this.$q
          .all(
            data.map((bridgedSubrange) => {
              return this.vrackAssignedIpv6Service
                .getBridgedSubrange(
                  this.serviceName,
                  this.ip.niceName,
                  bridgedSubrange,
                )
                .then((res) => {
                  return {
                    ...res.data,
                    model: SLAAC_VALUES[res.data.slaac],
                    loading: false,
                  };
                });
            }),
          )
          .then((bridges) => {
            this.bridgedSubranges = bridges;
          });
      });

    this.loadSubnet();
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
        this.trackClick('add-subnet');
        this.addSubnetModalContext.isOpenModal = false;
        this.CucCloudMessage.flushMessages('vrack');
        this.vrackAssignedIpv6Service
          .createSubnet(this.serviceName, this.ip.niceName, {
            routedSubrange,
            nexthop,
          })
          .then(({ data }) => {
            this.loader = true;
            this.watingTask(data.id, () => {
              this.loadSubnet();
            });
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

  toggleSubrange(bridgedSubrange) {
    this.trackClick('enable-ip-auto-config');
    const bridged = bridgedSubrange;
    bridged.loading = true;
    const targetValue = !bridged.model;
    this.CucCloudMessage.flushMessages('vrack');
    this.vrackAssignedIpv6Service
      .updateBridgedSubrange(
        this.serviceName,
        this.ip.niceName,
        bridged.bridgedSubrange,
        targetValue,
      )
      .then(({ data }) => {
        this.watingTask(data.id, () => {
          bridged.model = targetValue;
          bridged.loading = false;
        });
      })
      .catch((err) => {
        this.CucCloudMessage.error(
          [
            this.$translate.instant('vrack_error'),
            err?.data?.message || err.message || '',
          ].join(' '),
        );
      });
  }

  openDeleteSubnetModal(subnet) {
    this.deleteSubnetModalContext = {
      isOpenModal: true,
      onConfirm: () => {
        this.trackClick('remove-subnet');
        this.deleteSubnetModalContext.isOpenModal = false;
        this.CucCloudMessage.flushMessages('vrack');
        this.vrackAssignedIpv6Service
          .deleteSubnet(this.serviceName, this.ip.niceName, subnet)
          .then(({ data }) => {
            this.loader = true;
            this.watingTask(data.id, () => {
              this.loadSubnet();
            });
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

  loadSubnet() {
    this.vrackAssignedIpv6Service
      .fetchAllSubnets(this.serviceName, this.ip.niceName)
      .then(({ data }) => {
        this.$q
          .all(
            data.map((subnet) => {
              return this.vrackAssignedIpv6Service
                .getSubnet(this.serviceName, this.ip.niceName, subnet)
                .then((res) => res.data);
            }),
          )
          .then((subnets) => {
            this.loader = false;
            this.subnets = subnets;
          });
      });
  }

  watingTask(taskId, callback) {
    this.OvhApiVrack.v6()
      .task({
        serviceName: this.serviceName,
        taskId,
      })
      .$promise.then(() => {
        this.$timeout(() => {
          this.watingTask(taskId, callback);
        }, POLLING_INTERVAL);
      })
      .catch(() => {
        if (callback) callback();
      });
  }

  trackClick(hit, action = true) {
    this.atInternet.trackClick({
      name: `${VRACK_DASHBOARD_TRACKING_PREFIX}${
        action ? `::${VRACK_ACTIONS_SUFFIX}` : ''
      }::${hit}`,
      type: VRACK_ACTIONS_SUFFIX,
    });
  }
}
