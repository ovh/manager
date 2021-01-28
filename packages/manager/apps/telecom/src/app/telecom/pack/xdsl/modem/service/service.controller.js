export default class XdslModemServiceCtrl {
  /* @ngInject */
  constructor(
    $q,
    $stateParams,
    $translate,
    $uibModal,
    OvhApiXdsl,
    TucPackXdslModemMediator,
    TucToast,
  ) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
    this.mediator = TucPackXdslModemMediator;
    this.modemServices = [];
    this.OvhApiXdsl = OvhApiXdsl;
    this.TucToast = TucToast;
  }

  getBlocIP() {
    const blocIP = {
      name: 'blocIP',
      label: 'bloc_ip',
      isDefined: false,
    };
    return this.OvhApiXdsl.Modem()
      .BlocIp()
      .v6()
      .get({
        xdslId: this.$stateParams.serviceName,
      })
      .$promise.then(({ xdslTask }) => {
        blocIP.isDefined = true;
        blocIP.value = xdslTask === 'enabled';
        return xdslTask;
      })
      .finally(() => {
        this.modemServices.push(blocIP);
      });
  }

  updateBlocIp(status) {
    return this.OvhApiXdsl.Modem()
      .BlocIp()
      .v6()
      .post(
        {
          xdslId: this.$stateParams.serviceName,
        },
        {
          status,
        },
      )
      .$promise.then((xdslTask) => {
        this.mediator.setTask('changeModemBlocIpStatus');
        this.TucToast.success(
          this.$translate.instant('xdsl_modem_service_bloc_ip_doing'),
        );
        return xdslTask;
      })
      .catch((err) => {
        const blocip = this.getService('blocIP');
        blocip.value = !blocip.value;
        this.TucToast.error(
          this.$translate.instant(
            'xdsl_modem_service_bloc_ip_an_error_ocurred',
          ),
        );
        return this.$q.reject(err);
      });
  }

  getCallWaiting() {
    const callWaiting = {
      name: 'callWaiting',
      label: 'call_waiting',
      isDefined: false,
    };
    return this.OvhApiXdsl.Modem()
      .CallWaiting()
      .v6()
      .get({
        xdslId: this.$stateParams.serviceName,
      })
      .$promise.then(({ xdslTask }) => {
        callWaiting.isDefined = true;
        callWaiting.value = xdslTask === 'enabled';
        return xdslTask;
      })
      .finally(() => {
        this.modemServices.push(callWaiting);
      });
  }

  updateCallWaiting(status) {
    return this.OvhApiXdsl.Modem()
      .CallWaiting()
      .v6()
      .post(
        {
          xdslId: this.$stateParams.serviceName,
        },
        {
          callWaiting: status,
        },
      )
      .$promise.then((xdslTask) => {
        this.mediator.setTask('changeModemCallWaitingStatus');
        this.TucToast.success(
          this.$translate.instant('xdsl_modem_service_call_waiting_doing'),
        );
        return xdslTask;
      })
      .catch((err) => {
        const callWaiting = this.getService('callWaiting');
        callWaiting.value = !callWaiting.value;
        this.TucToast.error(
          this.$translate.instant(
            'xdsl_modem_service_call_waiting_an_error_ocurred',
          ),
        );
        return this.$q.reject(err);
      });
  }

  getContentSharing() {
    const contentSharing = {
      name: 'contentSharing',
      label: 'content_sharing',
      isDefined: false,
    };
    return this.OvhApiXdsl.Modem()
      .ContentSharing()
      .v6()
      .get({
        xdslId: this.$stateParams.serviceName,
      })
      .$promise.then(({ xdslTask }) => {
        contentSharing.value = xdslTask === 'enabled';
        contentSharing.isDefined = true;
        return xdslTask;
      })
      .finally(() => {
        this.modemServices.push(contentSharing);
      });
  }

  updateContentSharing(status) {
    return this.OvhApiXdsl.Modem()
      .ContentSharing()
      .v6()
      .post(
        {
          xdslId: this.$stateParams.serviceName,
        },
        {
          contentSharing: status,
        },
      )
      .$promise.then((xdslTask) => {
        this.mediator.setTask('changeModemContentSharingStatus');
        if (this.getService('ftp')) {
          const ftp = this.getService('ftp');
          if (ftp.isDefined) {
            ftp.value = !ftp.value;
            this.updateFTP(status);
          }
        }
        if (this.getService('upnp')) {
          const upnp = this.getService('upnp');
          if (upnp.isDefined) {
            upnp.value = !upnp.value;
            this.updateUPnP(status);
          }
        }
        this.TucToast.success(
          this.$translate.instant('xdsl_modem_service_content_sharing_doing'),
        );
        return xdslTask;
      })
      .catch((err) => {
        const contentSharing = this.getService('contentSharing');
        contentSharing.value = !contentSharing.value;
        this.TucToast.error(
          this.$translate.instant(
            'xdsl_modem_service_content_sharing_an_error_ocurred',
          ),
        );
        return this.$q.reject(err);
      });
  }

  getFTP() {
    const ftp = {
      name: 'ftp',
      label: 'ftp',
      isDefined: false,
    };
    return this.OvhApiXdsl.Modem()
      .Ftp()
      .v6()
      .get({
        xdslId: this.$stateParams.serviceName,
      })
      .$promise.then(({ xdslTask }) => {
        ftp.value = xdslTask === 'enabled';
        ftp.isDefined = true;
        return xdslTask;
      })
      .finally(() => {
        this.modemServices.push(ftp);
      });
  }

  updateFTP(status) {
    return this.OvhApiXdsl.Modem()
      .Ftp()
      .v6()
      .post(
        {
          xdslId: this.$stateParams.serviceName,
        },
        {
          ftp: status,
        },
      )
      .$promise.then((xdslTask) => {
        this.mediator.setTask('changeModemFtpStatus');
        this.TucToast.success(
          this.$translate.instant('xdsl_modem_service_ftp_doing'),
        );
        return xdslTask;
      })
      .catch((err) => {
        const ftp = this.getService('ftp');
        ftp.value = !ftp.value;
        this.TucToast.error(
          this.$translate.instant('xdsl_modem_service_ftp_an_error_ocurred'),
        );
        return this.$q.reject(err);
      });
  }

  getIpsecAlg() {
    const ipsecAlg = {
      name: 'ipsecAlg',
      label: 'ipsec_alg',
      isDefined: false,
    };
    return this.OvhApiXdsl.Modem()
      .IpsecAlg()
      .v6()
      .get({
        xdslId: this.$stateParams.serviceName,
      })
      .$promise.then(({ xdslTask }) => {
        ipsecAlg.value = xdslTask === 'enabled';
        ipsecAlg.isDefined = true;
        return xdslTask;
      })
      .finally(() => {
        this.modemServices.push(ipsecAlg);
      });
  }

  updateIpsecAlg(status) {
    return this.OvhApiXdsl.Modem()
      .IpsecAlg()
      .v6()
      .post(
        {
          xdslId: this.$stateParams.serviceName,
        },
        {
          ipsecAlg: status,
        },
      )
      .$promise.then((xdslTask) => {
        this.mediator.setTask('changeModemIpsecAlgStatus');
        this.TucToast.success(
          this.$translate.instant('xdsl_modem_service_ipsec_alg_doing'),
        );
        return xdslTask;
      })
      .catch((err) => {
        const ipsecAlg = this.getService('ipsecAlg');
        ipsecAlg.value = !ipsecAlg.value;
        this.TucToast.error(
          this.$translate.instant(
            'xdsl_modem_service_ipsec_alg_an_error_ocurred',
          ),
        );
        return this.$q.reject(err);
      });
  }

  getSipAlg() {
    const sipAlg = {
      name: 'sipAlg',
      label: 'sip_alg',
      isDefined: false,
    };
    return this.OvhApiXdsl.Modem()
      .SipAlg()
      .v6()
      .get({
        xdslId: this.$stateParams.serviceName,
      })
      .$promise.then(({ xdslTask }) => {
        sipAlg.value = xdslTask === 'enabled';
        sipAlg.isDefined = true;
        return xdslTask;
      })
      .finally(() => {
        this.modemServices.push(sipAlg);
      });
  }

  updateSipAlg(status) {
    return this.OvhApiXdsl.Modem()
      .SipAlg()
      .v6()
      .post(
        {
          xdslId: this.$stateParams.serviceName,
        },
        {
          sipAlg: status,
        },
      )
      .$promise.then((xdslTask) => {
        this.mediator.setTask('changeModemSipAlgStatus');
        this.TucToast.success(
          this.$translate.instant('xdsl_modem_service_sip_alg_doing'),
        );
        return xdslTask;
      })
      .catch((err) => {
        const sipAlg = this.getService('sipAlg');
        sipAlg.value = !sipAlg.value;
        this.TucToast.error(
          this.$translate.instant(
            'xdsl_modem_service_sip_alg_an_error_ocurred',
          ),
        );
        return this.$q.reject(err);
      });
  }

  getUPnP() {
    const upnp = {
      name: 'upnp',
      label: 'upnp',
      isDefined: false,
    };
    return this.OvhApiXdsl.Modem()
      .Upnp()
      .v6()
      .get({
        xdslId: this.$stateParams.serviceName,
      })
      .$promise.then(({ data }) => {
        console.log('upnp xdslTask', data);
        upnp.value = data === 'enabled';
        upnp.isDefined = true;
        return data;
      })
      .finally(() => {
        this.modemServices.push(upnp);
      });
  }

  updateUPnP(status) {
    return this.OvhApiXdsl.Modem()
      .Upnp()
      .v6()
      .post(
        {
          xdslId: this.$stateParams.serviceName,
        },
        {
          upnp: status,
        },
      )
      .$promise.then((xdslTask) => {
        this.mediator.setTask('changeModemUPnPStatus');
        this.TucToast.success(
          this.$translate.instant('xdsl_modem_service_upnp_doing'),
        );
        return xdslTask;
      })
      .catch((err) => {
        const upnp = this.getService('upnp');
        upnp.value = !upnp.value;
        this.TucToast.error(
          this.$translate.instant('xdsl_modem_service_upnp_an_error_ocurred'),
        );
        return this.$q.reject(err);
      });
  }

  getService(name) {
    return this.modemServices.find((service) => service.name === name);
  }

  changeValue(name, value) {
    switch (name) {
      case 'blocIP':
        this.updateBlocIp(value ? 'enabled' : 'disabled');
        break;
      case 'callWaiting':
        this.updateCallWaiting(value ? 'enabled' : 'disabled');
        break;
      case 'contentSharing':
        this.$uibModal
          .open({
            animation: true,
            templateUrl:
              'app/telecom/pack/xdsl/modem/service/modal/service-modal.html',
            controller: 'XdslModemServiceModalCtrl',
            controllerAs: '$ctrl',
          })
          .result.then((result) => {
            switch (result) {
              case 'cancel': {
                const contentSharing = this.getService('contentSharing');
                contentSharing.value = !value;
                break;
              }
              default:
                this.updateContentSharing(value ? 'enabled' : 'disabled');
                break;
            }
          });
        break;
      case 'ftp':
        this.updateFTP(value ? 'enabled' : 'disabled');
        break;
      case 'ipsecAlg':
        this.updateIpsecAlg(value ? 'enabled' : 'disabled');
        break;
      case 'sipAlg':
        this.updateSipAlg(value ? 'enabled' : 'disabled');
        break;
      case 'upnp':
        console.log('upnp value', value);
        this.updateUPnP(value ? 'enabled' : 'disabled');
        break;
      default:
        break;
    }
  }

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */
  $onInit() {
    return this.$q.all([
      this.getBlocIP(),
      this.getCallWaiting(),
      this.getContentSharing(),
      this.getFTP(),
      this.getIpsecAlg(),
      this.getSipAlg(),
      this.getUPnP(),
    ]);
  }

  /* -----  End of INITIALIZATION  ------*/
}
