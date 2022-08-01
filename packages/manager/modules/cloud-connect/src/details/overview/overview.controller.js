import { get } from 'lodash';

import { POP_MAP } from '../../cloud-connect.constants';

export default class CloudConnectOverviewCtrl {
  /* @ngInject */
  constructor($translate, $window, CucCloudMessage, cloudConnectService) {
    this.$translate = $translate;
    this.$window = $window;
    this.CucCloudMessage = CucCloudMessage;
    this.cloudConnectService = cloudConnectService;
    this.$translate = $translate;
    this.POP_MAP = POP_MAP;
  }

  $onInit() {
    this.loadMessages();
    this.loadServiceInfo();
    if (this.cloudConnect.isVrackAssociated()) {
      this.loadVrackDetails(this.cloudConnect.vrack);
      this.loadInterfaces();
      this.loadPopConfigurations().then(() => {
        if (this.cloudConnect.isPopConfigurationExists()) {
          this.loadDatacenterConfigurations();
        }
      });
    }
    if (!this.cloudConnect.isDirectService()) {
      this.loadServiceKeys();
    }
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('cloud-connect.details.overview');
    this.messageHandler = this.CucCloudMessage.subscribe(
      'cloud-connect.details.overview',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  loadVrackDetails(vrackId) {
    this.loadingVrack = true;
    this.cloudConnectService
      .getVrackDetails(vrackId)
      .then((vrack) => this.cloudConnect.setVrackName(vrack.name))
      .catch(() => this.cloudConnect.setVrackName(vrackId))
      .finally(() => {
        this.loadingVrack = false;
      });
  }

  loadServiceInfo() {
    return this.cloudConnectService
      .getCloudConnectServiceInfo(this.cloudConnect.id)
      .then((serviceInfos) => {
        this.serviceInfos = serviceInfos;
        this.serviceInfos.creationDate = moment(
          serviceInfos.creation,
          'YYYY/MM/DD',
        ).format('LL');
        this.loadServices(serviceInfos.serviceId);
        this.getCancelTerminationUrl(serviceInfos.domain).then((url) => {
          this.cancelTerminationUrl = url;
        });
        return serviceInfos;
      });
  }

  loadServices(serviceId) {
    return this.cloudConnectService.getProductName(
      serviceId,
      this.cloudConnect,
    );
  }

  loadPopConfigurations() {
    return this.cloudConnectService
      .loadPopConfigurations(this.cloudConnect)
      .catch((error) =>
        this.CucCloudMessage.error(
          this.$translate.instant('cloud_connect_pop_get_configuration_error', {
            message: get(error, 'data.message', error.message),
          }),
        ),
      );
  }

  loadInterfaces() {
    return this.cloudConnectService
      .loadInterfaces(this.cloudConnect)
      .catch((error) =>
        this.CucCloudMessage.error(
          this.$translate.instant('cloud_connect_pop_get_configuration_error', {
            message: get(error, 'data.message', error.message),
          }),
        ),
      );
  }

  loadServiceKeys() {
    return this.cloudConnectService
      .loadServiceKeys(this.cloudConnect)
      .catch((error) =>
        this.CucCloudMessage.error(
          this.$translate.instant('cloud_connect_service_key_get_error', {
            message: get(error, 'data.message', error.message),
          }),
        ),
      );
  }

  loadDatacenterConfigurations() {
    this.cloudConnectService
      .loadDatacenterConfigurations(this.cloudConnect, this.datacenters)
      .then(() => {
        if (this.cloudConnect.datacenterConfigurations) {
          return this.cloudConnectService.getExtras(this.cloudConnect);
        }
        return null;
      })
      .catch((error) =>
        this.CucCloudMessage.error(
          this.$translate.instant('cloud_connect_dc_get_configuration_error', {
            message: get(error, 'data.message', error.message),
          }),
        ),
      );
  }

  getBandwidth(bandwidth) {
    const array = bandwidth.split('');
    const bandwidthNumber = parseInt(bandwidth, 10);
    return `${bandwidthNumber} ${this.$translate.instant(
      `cloud_connect_common_${array[array.length - 1]}`,
    )}`;
  }

  getPopTypeName(typeId) {
    return this.cloudConnectService.getPopTypeName(typeId);
  }

  downloadLOA() {
    this.cloudConnectService.trackClick(
      'cloud-connect::overview::download-loa',
    );
    this.downloadingLoa = true;
    this.cloudConnectService
      .downloadLOA(this.cloudConnect.id)
      .then((url) => this.$window.open(url, '_blank', 'noopener'))
      .catch((error) =>
        this.CucCloudMessage.error(
          this.$translate.instant('cloud_connect_loa_download_error', {
            message: get(error, 'data.message', error.message),
          }),
        ),
      )
      .finally(() => {
        this.downloadingLoa = false;
      });
  }

  getPopDescription(popName) {
    return this.POP_MAP[popName] ? this.POP_MAP[popName] : popName;
  }
}
