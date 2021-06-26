import forEach from 'lodash/forEach';
import isFunction from 'lodash/isFunction';

const regRootDevice1 = new RegExp('^/dev/[hs]d[ab][0-9]+$');
const regRootDevice2 = new RegExp('^/dev/md[0-9]+$');
const regRootDevice3 = new RegExp('^/dev/rd/c0p0[0-9]+$');
const regRootDevice4 = new RegExp('^/dev/ram0$');

export default class BmServerComponentsNetbootCtrl {
  /* @ngInject */
  constructor($http, $q, $translate, atInternet, netbootService) {
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.netbootService = netbootService;
  }

  $onInit() {
    this.HARDDISK = 'harddisk';
    this.RESCUE = 'rescue';
    this.NETWORK = 'network';

    this.loading = {
      init: true,
      setNetboot: false,
    };
    this.isValid = {
      root: null,
      rescueMail: null,
    };

    this.netboots = null; // all available netboot
    this.networkNetboot = null; // network available netboot
    this.currentNetboot = {}; // current netboot option
    this.rootDevice = {
      root: null,
    };

    this.loadNetboots();
  }

  getCurrent() {
    forEach(this.netboots, (eachNetboot, netbootType) => {
      this.currentNetboot[netbootType] = '';

      if (netbootType === this.NETWORK) {
        this.networkNetboot = eachNetboot;
      } else if (netbootType === this.HARDDISK) {
        this.currentNetboot.harddisk = {
          // because harddisk hasn't option
          id: eachNetboot[0].id,
        };
      }

      forEach(eachNetboot, (eachNetbootItem) => {
        if (eachNetbootItem.id === this.server.bootId) {
          this.currentNetboot.type = eachNetbootItem.type.toLowerCase();
          this.currentNetboot[netbootType] = eachNetbootItem;
        }
      });
    });

    if (this.server.rootDevice) {
      this.rootDevice.root = this.server.rootDevice;
    }
  }

  firstStepValidation() {
    return (
      this.currentNetboot.type === this.HARDDISK ||
      (this.currentNetboot.type === this.RESCUE &&
        this.currentNetboot.rescue !== '' &&
        this.isValid.rescueMail) ||
      (this.currentNetboot.type === this.NETWORK &&
        this.currentNetboot.network !== '' &&
        this.isValid.root)
    );
  }

  onRootDeviceChange() {
    if (this.configurationForm) {
      const rootDeviceEle = this.configurationForm.rootdevice;
      rootDeviceEle.$setValidity('path', true);
    }
  }

  onConfigurationSubmit(configurationForm) {
    if (this.currentNetboot.type !== this.NETWORK) {
      return;
    }
    this.configurationForm = configurationForm;
    const rootDeviceEle = configurationForm.rootdevice;
    const isValid = this.rootDeviceValidation();
    rootDeviceEle.$setValidity('path', isValid);
    this.isInConfigurationStep = !isValid;
  }

  rootDeviceValidation() {
    return (
      regRootDevice1.test(this.rootDevice.root) ||
      regRootDevice2.test(this.rootDevice.root) ||
      regRootDevice3.test(this.rootDevice.root) ||
      regRootDevice4.test(this.rootDevice.root)
    );
  }

  static getActiveOptions(networkOption) {
    return networkOption.value !== 'N';
  }

  setNetboot() {
    const netbootId = this.currentNetboot[this.currentNetboot.type].id;
    const rootDevice =
      (this.currentNetboot.type === this.NETWORK && this.rootDevice.root) ||
      this.server.rootDevice;
    const netbootType = this.currentNetboot.type;

    this.loading.setNetboot = true;

    const promiseList = [
      this.netbootService.setNetBoot(
        this.serviceName,
        netbootId,
        rootDevice,
        netbootType,
      ),
    ];
    if (this.currentNetboot.type === this.RESCUE) {
      promiseList.push(
        this.netbootService.updateRescueMail(
          this.serviceName,
          netbootId,
          this.currentNetboot.rescueMail,
        ),
      );
    }

    this.$q
      .all(promiseList)
      .then(() => {
        this.goBack(
          this.$translate.instant('server_configuration_netboot_success'),
        );
      })
      .catch((error) =>
        this.handleError(
          error,
          this.$translate.instant('server_configuration_netboot_fail', {
            t0: this.server.name,
          }),
        ),
      )
      .finally(() => {
        this.loading.setNetboot = false;
      });
  }

  loadRescueMail() {
    this.netbootService
      .getRescueMail(this.serviceName)
      .then((server) => {
        this.currentNetboot.rescueMail = server.rescueMail;
      })
      .catch((error) =>
        this.handleError(
          error,
          this.$translate.instant(
            'server_configuration_netboot_loading_error',
            { t0: this.server.name },
          ),
        ),
      );
  }

  loadNetboots() {
    this.loading.init = true;
    this.netbootService
      .getNetboot(this.serviceName)
      .then((netboots) => {
        this.netboots = netboots;
        if (this.netboots.ipxeCustomerScript) {
          delete this.netboots.ipxeCustomerScript;
        }

        this.getCurrent();
        this.loadRescueMail();
      })
      .catch((error) =>
        this.handleError(
          error,
          this.$translate.instant(
            'server_configuration_netboot_loading_error',
            { t0: this.server.name },
          ),
        ),
      )
      .finally(() => {
        this.loading.init = false;
      });
  }

  goBack(message = false) {
    if (isFunction(this.onGoBack)) {
      this.onGoBack({ message });
    }
  }

  handleError(error, message = null) {
    if (isFunction(this.onError)) {
      this.onError({
        error: { message, data: error },
      });
    }
  }

  handleSuccess(message) {
    if (isFunction(this.onSuccess)) {
      this.onSuccess({
        message,
      });
    }
  }
}
