import moment from 'moment';
import flatten from 'lodash/flatten';
import camelCase from 'lodash/camelCase';
import range from 'lodash/range';
import set from 'lodash/set';
import Inputs from '../../inputs/inputs.class';
import {
  INPUTS_RULES
} from '../../inputs/constants';

export default class ServerInstallationGabaritCtrl {
  /* @ngInject */
  constructor(
    $rootScope,
    $state,
    $scope,
    $q,
    $translate,
    atInternet,
    Server,
    $filter,
    Alerter,
    $stateParams,
  ) {
    this.$rootScope = $rootScope;
    this.$state = $state;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.Server = Server;
    this.$q = $q;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.$filter = $filter;
    this.Alerter = Alerter;
  }

  $onInit() {
    this.$scope.inputRules = INPUTS_RULES;

    this.$scope.installation = {
      server: { ...this.server },
      familyType: [],
      distributionList: null,

      selectFamily: null,
      selectGabarit: null,
      selectLanguage: null,
      selectSoftRaidOnlyMirroring: null,

      diskGroupId: null,
      hasData: false,
      deleteGabarit: null,
      nbDiskUse: null, // if nbPhysicalDisk > 2 user can select nb disk to use

      options: {
        saveGabarit: false,
        gabaritNameSave: null,
        customHostname: null,
        postInstallationScriptLink: null,
        postInstallationScriptReturn: null,
        sshKeyName: null,
        useSpla: false,
        validForm: true,
      },
    };

    // Nb of disk use for partitionning.
    // If server has Raid controller, nbDisk = 1, nbPhysicalDisk = n
    this.$scope.informations = {
      nbDisk: 0,
      hardwareRaid: null,
      hardwareRaidCompatible: true,
    };

    this.$scope.errorGab = {
      ws: false,
    };

    this.$scope.countFilter = [];

    this.$scope.loader = {
      loading: false,
      loadingForm: false,
    };

    if (this.$scope.installation.deleteGabarit) {
      this.atInternet.trackPage({
        name:
          'dedicated::dedicated::server::system-install::existing-template::delete-template',
        type: 'navigation',
      });
    }

    this.$scope.loader.loading = true;
    this.$scope.installation.selectGabarit = null;
    this.$scope.installation.partitionSchemesList = null;
    this.$scope.installation.selectPartitionScheme = null;
    this.$scope.installation.selectFamily = null;
    this.$scope.installation.selectLanguage = null;
    this.$scope.installation.selectSoftRaidOnlyMirroring = null;
    this.$scope.installation.deleteGabarit = null;

    this.$scope.optionForm = null;

    // Call after delete gabarit
    this.$scope.$on('dedicated.installation.gabarit.refresh', () => {
      this.load();
    });

    this.$scope.$on(
      'dedicated.informations.reinstall.form.update',
      (e, validForm) => {
        this.$scope.installation.options.validForm = validForm;
      },
    );

    this.$scope.sshList = {
      model: [],
      error: false,
    };

    this.$scope.loader.loadingForm = true;
    this.Server.getSshKey(this.$stateParams.productId).then(
      (data) => {
        this.$scope.sshList.error = false;
        this.$scope.sshList.model = data;
        this.$scope.loader.loadingForm = false;
      },
      () => {
        this.$scope.sshList.error = true;
        this.$scope.loader.loadingForm = false;
      },
    );

    this.$scope.$watch('optionForm.$valid', () => {
      this.$rootScope.$broadcast(
        'dedicated.informations.reinstall.form.update',
        this.$scope.optionForm?.$valid,
      );
    });
  }

  static setSizeModalDialog(bigSize) {
    document
      .querySelector('[class*="modal-dialog"]')
      .setAttribute(
        'class',
        bigSize ? 'modal-dialog dedicated-server-large-modal' : 'modal-dialog',
      );
  }

  // ------CUSTOME STEP MODAL------
  static reduceModal() {
    ServerInstallationGabaritCtrl.setSizeModalDialog(false);
  }

  static extendModal() {
    ServerInstallationGabaritCtrl.setSizeModalDialog(true);
  }

  load() {
    this.Server.getPersonalTemplates(this.$stateParams.productId)
      .then((templateList) => {
        this.$scope.installation.familyType = templateList.family;
        this.$scope.installation.distributionList =
          templateList.templates.results;
        this.$scope.informations.nbDisk = this.$scope.installation.server.nbDisk;
        this.$scope.installation.nbDiskUse = this.$scope.installation.server.nbDisk;
      })
      .catch((data) => {
        this.Alerter.alertFromSWS(
          this.$translate.instant(
            'server_configuration_installation_ovh_fail_os',
            {
              t0: this.$scope.installation.server.name,
            },
          ),
          data.data,
          'server_dashboard_alert',
        );
        this.goBack();
      })
      .finally(() => {
        this.$scope.loader.loading = false;
      });
  }

  getCountFilter(itemFamily) {
    const tab = this.$filter('filter')(
      this.$scope.installation.distributionList,
      {
        family: itemFamily,
      },
    );
    this.$scope.countFilter[itemFamily] = tab.length;

    if (this.$scope.countFilter[itemFamily] > 0) {
      if (!this.$scope.installation.selectFamily) {
        this.$scope.installation.selectFamily = itemFamily;
      }
      this.$scope.installation.hasData = true;
    }
    return tab;
  }

  setSelectGabarit(gabarit) {
    this.$scope.installation.selectGabarit = gabarit;
    this.$scope.installation.selectLanguage = this.$scope.installation.selectGabarit.defaultLanguage;
    this.$scope.installation.selectSoftRaidOnlyMirroring = this.$scope.installation.selectGabarit.softRaidOnlyMirroring;

    this.$scope.installation.inputs =
      this.$scope.installation.selectGabarit.inputs || [];
  }

  clearErrorPersonalTemplate() {
    this.$scope.errorGab.ws = null;
    ServerInstallationGabaritCtrl.reduceModal();
  }

  static getDisks(disks) {
    if (disks && disks[0].indexOf('[') > -1) {
      return flatten(
        disks.map((_elem) => {
          const elem = _elem.replace(/\[|\]/g, '');
          return elem.split(',');
        }),
      );
    }
    return disks;
  }

  // call after select gabarit
  loadStep2() {
    let tempHardwareRaid;
    this.$scope.loader.loading = true;
    this.$scope.informations.hardwareRaid = null;
    this.$scope.informations.hardwareRaidCompatible = true;
    this.$scope.installation.options = {
      saveGabarit: false,
      gabaritNameSave: null,
      customHostname: this.$scope.installation.selectGabarit.customHostname,
      postInstallationScriptLink: this.$scope.installation.selectGabarit
        .postInstallationScriptLink,
      postInstallationScriptReturn: this.$scope.installation.selectGabarit
        .postInstallationScriptReturn,
      sshKeyName: this.$scope.installation.selectGabarit.sshKeyName,
      useSpla: false,
      validForm: true,
    };

    if (this.$scope.installation.inputs.length > 0) {
      ServerInstallationGabaritCtrl.extendModal();
    }

    this.Server.getPartitionSchemesByPriority(
      this.$stateParams.productId,
      this.$scope.installation.selectGabarit.id,
    )
      .then((response) => {
        this.$scope.installation.partitionSchemesList = response;
        [this.$scope.installation.selectPartitionScheme] = response;
        return response;
      })
      .then((response) =>
        this.Server.getPartitionSchemeHardwareRaid(
          this.$stateParams.productId,
          this.$scope.installation.selectGabarit.id,
          response[0],
        ),
      )
      .then((response) => {
        if (response[0]) {
          [tempHardwareRaid] = response;
          return this.Server.getHardwareRaidProfile(
            this.$stateParams.productId,
          );
        }
        return null;
      })
      .catch((error) => {
        if (this.Server.isHardRaidLocationError(error)) {
          this.$scope.errorGab.ws = this.$translate.instant(
            'server_configuration_installation_ovh_step1_hardwareRaid_wrong_location',
          );
          this.$scope.informations.hardwareRaidCompatible = false;
        } else if (this.Server.isHardRaidUnavailableError(error)) {
          this.$scope.errorGab.ws = this.$translate.instant(
            'server_configuration_installation_gabarit_step2_hardwareRaid_incompatible_noHardwareRaid',
          );
          this.$scope.informations.hardwareRaidCompatible = false;
        } else {
          this.$q.reject(error);
        }
      })
      .then(() => {
        if (tempHardwareRaid) {
          this.$scope.informations.hardwareRaid = tempHardwareRaid;
          if (!this.$scope.installation.server.raidController) {
            this.$scope.errorGab.ws = this.$translate.instant(
              'server_configuration_installation_gabarit_step2_hardwareRaid_incompatible_noHardwareRaid',
            );
            this.$scope.informations.hardwareRaidCompatible = false;
          } else {
            this.$scope.informations.hardwareRaid.disks = ServerInstallationGabaritCtrl.getDisks(
              this.$scope.informations.hardwareRaid.disks,
            );
            if (
              this.$scope.installation.server.nbPhysicalDisk <
              this.$scope.informations.hardwareRaid.disks.length
            ) {
              this.$scope.errorGab.ws = this.$translate.instant(
                'server_configuration_installation_gabarit_step2_hardwareRaid_incompatible_disks',
                {
                  t0: this.$scope.installation.server.nbPhysicalDisk,
                  t1: this.$scope.informations.hardwareRaid.disks.length,
                },
              );
              this.$scope.informations.hardwareRaidCompatible = false;
            }
          }
        }
      })
      .catch((error) => {
        this.Alerter.alertFromSWS(
          this.$translate.instant(
            'server_configuration_installation_ovh_fail_partition_schemes',
            { t0: this.$scope.installation.server.name },
          ),
          error,
          'server_dashboard_alert',
        );
        this.goBack();
      })
      .finally(() => {
        this.$scope.loader.loading = false;
      });
  }

  deleteGabarit() {
    this.atInternet.trackClick({
      name:
        'dedicated::dedicated::server::system-install::existing-template::delete-template::confirm',
      type: 'action',
    });
    this.$scope.loader.loading = true;

    this.Server.deleteGabarit(
      this.$stateParams.productId,
      this.$scope.installation.deleteGabarit.id,
    ).then(
      () => {
        this.$scope.errorGab.ws = null;
        this.$scope.installation.deleteGabarit = null;
      },
      (data) => {
        this.$scope.errorGab.ws = this.$translate.instant(
          'server_configuration_installation_gabarit_step1_delete_fail',
          {
            t0: this.$scope.installation.deleteGabarit.displayName,
            t1: data.data.message,
          },
        );
      },
    );
  }

  // ------INSTALL------

  startInstall() {
    this.atInternet.trackClick({
      name:
        'dedicated::dedicated::server::system-install::existing-template::install',
      type: 'action',
    });

    this.$scope.loader.loading = true;
    const inputs = new Inputs(this.$scope.installation.inputs);
    this.Server.startInstallation(
      this.$stateParams.productId,
      this.$scope.installation.selectGabarit.id,
      this.$scope.installation.selectPartitionScheme,
      {
        language: camelCase(this.$scope.installation.selectLanguage),
        customHostname: this.$scope.installation.options.customHostname,
        postInstallationScriptLink: this.$scope.installation.options
          .postInstallationScriptLink,
        postInstallationScriptReturn: this.$scope.installation.options
          .postInstallationScriptReturn,
        sshKeyName: this.$scope.installation.options.sshKeyName,
        useSpla: this.$scope.installation.options.useSpla,
        softRaidDevices:
          this.$scope.informations.nbDisk > 2 &&
          this.$scope.installation.nbDiskUse > 1
            ? this.$scope.installation.nbDiskUse
            : null,
        noRaid:
          this.$scope.installation.nbDiskUse === 1 &&
          !this.$scope.informations.raidController,
      },
      inputs.answersHash2userMetadata(this.$scope.installation.input),
    )
      .then(
        (task) => {
          set(task, 'id', task.taskId);
          this.$rootScope.$broadcast('dedicated.informations.reinstall', task);
          this.$state.go(
            `app.dedicated-server.server.dashboard.installation-progress`,
          );
        },
        (data) => {
          this.$scope.errorGab.ws = this.$translate.instant(
            'server_configuration_installation_gabarit_step2_error',
            {
              t0: this.$scope.installation.selectGabarit.displayName,
              t1: this.$scope.installation.server.name,
              t2: this.$scope.installation.selectLanguage,
              t3: data.message,
            },
          );
        },
      )
      .finally(() => {
        this.$scope.loader.loading = false;
      });
  }

  install() {
    if (this.$scope.installation.options.saveGabarit) {
      this.$scope.loader.loading = true;
      this.Server.putSetGabarit(
        this.$stateParams.productId,
        this.$scope.installation.selectGabarit.id,
        this.$scope.installation.options.gabaritNameSave,
        {
          customHostname: this.$scope.installation.options.customHostname,
          postInstallationScriptLink: this.$scope.installation.options
            .postInstallationScriptLink,
          postInstallationScriptReturn: this.$scope.installation.options
            .postInstallationScriptReturn,
          sshKeyName: this.$scope.installation.options.sshKeyName,
        },
      ).then(
        () => {
          this.$scope.installation.selectGabarit.displayName = angular.copy(
            this.$scope.installation.options.gabaritNameSave,
          );
          this.$scope.installation.selectGabarit.id = angular.copy(
            this.$scope.installation.options.gabaritNameSave,
          );
          this.startInstall();
        },
        (data) => {
          this.$scope.loader.loading = false;
          this.$scope.errorGab.ws = this.$translate.instant(
            'server_configuration_installation_error_save',
            { t0: data.data.message },
          );
        },
      );
    } else {
      this.startInstall();
    }
  }

  // Return false if endOfInstall is undefined or 2999-12-31
  static showEndOfLifeMessage(endOfInstall, showWarning) {
    if (!endOfInstall) return false;
    const endOfInstallDate = moment.utc(endOfInstall);
    if (endOfInstallDate.isSame(moment.utc('2999-12-31'))) return false;
    const period = moment().add(6, 'months');
    return showWarning
      ? endOfInstallDate.isBefore(period)
      : endOfInstallDate.isAfter(period);
  }

  getEndOfLifeMessage(gabarit) {
    // decoding &#34; codes to '"' by using replace
    return `
        ${this.$translate.instant(
          'dedicated_servers_installation_template_wizard_prefix_message',
        )}
        ${this.$filter('date')(gabarit.endOfInstall, 'mediumDate')}
        ${this.$translate.instant(
          'dedicated_servers_installation_customer_template_wizard_message',
          {
            osName: gabarit.distribution,
            customerTemplateName: gabarit.id,
          },
        )}`.replaceAll(/&#34;/g, '"');
  }

  // return range between 1 and nbdisque of server if > 1
  getNbDisqueList(nbdisk) {
    if (nbdisk > 1 && !this.$scope.installation.selectSoftRaidOnlyMirroring) {
      return range(1, nbdisk + 1);
    }
    if (nbdisk > 1 && this.$scope.installation.selectSoftRaidOnlyMirroring) {
      // For softRaidOnlyMirroring: Disks used for installation list should be limited to 2
      this.$scope.installation.nbDiskUse =
        this.$scope.installation.nbDiskUse === 1
          ? this.$scope.installation.nbDiskUse
          : 2;
      return range(1, 3);
    }
    return [nbdisk];
  }

  nameGabaritValidator() {
    return this.$scope.optionForm?.gabaritNameSave.$setValidity(
      'pattern',
      !this.$scope.installation.options.saveGabarit ||
        /^[a-zA-Z0-9-]{1,50}$/.test(
          this.$scope.installation.options.gabaritNameSave,
        ),
    );
  }

  postInstallationScriptLinkValidator() {
    const input = this.$scope.optionForm?.postInstallationScriptLink;
    const val = this.$scope.installation.options.postInstallationScriptLink;
    const regexpCheckPort = /^(((https|http|ftp|ftps|ftpes)?:\/\/)?(([^:/]*\.?)*))(:(\d+))?(\/|$)/g;
    const regexpUrlContent = /^([a-zA-Z0-9-./_:~% ]+)$/;
    const regexpUrlProtocol = /^((https|http|ftp|ftps|ftpes)?:\/\/).*/;
    const regexpUrlExtension = /.*(\.zip|\.tar\.gz|\.sh|\.pl|\.cgi)$/;
    const infoUrl = regexpCheckPort.exec(val);
    let port;

    if (val) {
      port = infoUrl ? infoUrl[6] : null;

      input.$setValidity(
        'bad_port_script',
        !port || (port >= 0 && port <= 65535),
      );
      input.$setValidity('bad_url_script', regexpUrlContent.test(val));
      input.$setValidity('bad_protocol_script', regexpUrlProtocol.test(val));
      input.$setValidity('bad_extension_script', regexpUrlExtension.test(val));
    } else {
      input.$setValidity('bad_port_script', true);
      input.$setValidity('bad_url_script', true);
      input.$setValidity('bad_protocol_script', true);
      input.$setValidity('bad_extension_script', true);
    }
  }
}
