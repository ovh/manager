import forEach from 'lodash/forEach';
import isFunction from 'lodash/isFunction';

import { getNetbootGuideUrl, UNSUPPORTED_SSH_KEY_RESCUES } from './constants';

export default class BmServerComponentsNetbootCtrl {
  /* @ngInject */
  constructor(
    $http,
    $q,
    $translate,
    atInternet,
    coreConfig,
    netbootService,
    $anchorScroll,
    $location,
  ) {
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
    this.ovhSubsidiary = coreConfig.getUser().ovhSubsidiary;
    this.atInternet = atInternet;
    this.netbootService = netbootService;
    this.$anchorScroll = $anchorScroll;
    this.$location = $location;
  }

  $onInit() {
    this.isNutanixNode = this.isNutanixNode ? this.isNutanixNode : false;
    this.HARDDISK = 'harddisk';
    this.RESCUE = 'rescue';
    this.NETWORK = 'network';
    this.SSHKEY = 'sshkey';
    this.PASSWORD = 'password';

    this.DEFAULT_RESCUE = 'rescue-customer';

    this.loading = {
      init: true,
      setNetboot: false,
    };

    this.netboots = null; // all available netboot
    this.rescueAuthMethods = ['password', 'sshkey']; // rescue auth methods
    this.currentAuthMethod = null;
    this.networkNetboot = null; // network available netboot
    this.currentNetboot = {}; // current netboot option
    this.ssh = {
      publicKey: '',
    };
    this.rootDevice = {
      root: null,
    };
    this.hardwareDiagnosticsGuide = getNetbootGuideUrl(this.ovhSubsidiary);

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
        if (
          netbootType === this.RESCUE &&
          eachNetbootItem.kernel === this.DEFAULT_RESCUE
        ) {
          this.currentNetboot[netbootType] = eachNetbootItem;
        }
      });
    });

    if (this.server.rootDevice) {
      this.rootDevice.root = this.server.rootDevice;
    }
  }

  onRootDeviceChange() {
    if (this.configurationForm) {
      const rootDeviceEle = this.configurationForm.rootdevice;
      rootDeviceEle.$setValidity('path', true);
    }
  }

  onRescueKernelChange() {
    const selectedKernel = this.currentNetboot.rescue.kernel;
    if (UNSUPPORTED_SSH_KEY_RESCUES.some((v) => selectedKernel.includes(v))) {
      this.rescueAuthMethods = this.rescueAuthMethods.filter(
        (v) => v !== this.SSHKEY,
      );
      this.currentAuthMethod = this.PASSWORD;
      this.ssh.publicKey = '';
    } else {
      this.rescueAuthMethods.push(this.SSHKEY);
      this.loadRescueSshKey();
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
    const regRootDevice = new RegExp(/(\b.*[a-zA-Z]+.*\b)/g);
    return regRootDevice.test(this.rootDevice.root);
  }

  static getActiveOptions(networkOption) {
    return networkOption.value !== 'N';
  }

  setNetboot() {
    const netbootId = this.currentNetboot[this.currentNetboot.type].id;
    let rootDevice = null;
    if (this.currentNetboot.type === this.NETWORK) {
      rootDevice = this.rootDevice.root;
    } else if (this.currentNetboot.type !== this.RESCUE) {
      rootDevice = this.server.rootDevice;
    }

    this.trackClick(`confirm_${this.currentNetboot.type}`);

    this.loading.setNetboot = true;

    if (
      this.currentNetboot.type === this.RESCUE &&
      this.currentAuthMethod === this.PASSWORD
    )
      this.ssh.publicKey = '';

    this.$q
      .all([
        this.netbootService.setNetBoot(
          this.serviceName,
          netbootId,
          rootDevice,
          this.currentNetboot.rescueMail,
          this.ssh.publicKey,
        ),
      ])
      .then(() => {
        this.goBack(
          this.$translate.instant('server_configuration_netboot_success'),
        );
      })
      .catch((error) => {
        this.loading.setNetboot = false;
        return this.handleError(
          error,
          this.$translate.instant('server_configuration_netboot_fail', {
            t0: this.server.name,
            message: error.message || error.data?.message,
          }),
        );
      });
  }

  loadRescueMail() {
    this.netbootService
      .getServerInfos(this.serviceName)
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

  loadRescueSshKey() {
    this.netbootService
      .getServerInfos(this.serviceName)
      .then((server) => {
        this.ssh.publicKey = server.rescueSshKey;
        if (this.ssh.publicKey !== '') this.currentAuthMethod = this.SSHKEY;
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
        if (this.isNutanixNode) {
          delete this.netboots.network;
        }
        this.getCurrent();
        this.loadRescueMail();
        this.loadRescueSshKey();
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
    this.trackClick('cancel');
    if (isFunction(this.onGoBack)) {
      this.onGoBack({ message });
    }
  }

  handleError(error, message = null) {
    this.scrollToTop();
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

  scrollToTop() {
    this.$location.hash(this.scrollTopId);
    this.$anchorScroll();
  }

  trackClick(trackText) {
    if (this.trackingPrefix) {
      this.atInternet.trackClick({
        name: `${this.trackingPrefix}::${trackText}`,
        type: 'action',
      });
    }
  }
}
