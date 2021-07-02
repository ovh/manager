import angular from 'angular';
import flatten from 'lodash/flatten';
import map from 'lodash/map';
import camelCase from 'lodash/camelCase';
import range from 'lodash/range';
import set from 'lodash/set';
import isFunction from 'lodash/isFunction';
import forEach from 'lodash/forEach';
import sortBy from 'lodash/sortBy';

import Utils from '../utils';

export default class BmServerComponentsOsInstallGabaritCtrl {
  /* @ngInject */
  constructor($http, $q, $translate, atInternet, osInstallService) {
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.osInstallService = osInstallService;
  }

  $onInit() {
    this.installation = {
      server: this.server,
      familyType: [],
      distributionList: null,

      selectFamily: null,
      selectGabarit: null,
      selectLanguage: null,

      diskGroupId: null,
      hasData: false,
      deleteGabarit: null,
      nbDiskUse: null, // if nbPhysicalDisk > 2 user can select nb disk to use
    };

    this.initializeOptions();

    // Nb of disk use for partitionning.
    // If server has Raid controller, nbDisk = 1, nbPhysicalDisk = n
    this.informations = {
      nbDisk: 0,
      hardwareRaid: null,
      hardwareRaidCompatible: true,
    };

    this.errorGab = {
      ws: false,
      delete: false,
    };

    this.countFilter = [];

    this.loader = {
      loading: false,
      isInstalling: false,
      loadingHardwareRaidDetails: false,
      deletingGabarit: false,
    };

    this.load();
  }

  initializeOptions() {
    this.installation.options = {
      saveGabarit: false,
      gabaritNameSave: null,
      changeLog: null,
      customHostname: null,
      postInstallationScriptLink: null,
      postInstallationScriptReturn: null,
      sshKeyName: null,
      useDistributionKernel: false,
      installSqlServer: false,
      useSpla: false,
      validForm: true,
    };
  }

  load() {
    this.loader.loading = true;
    this.installation.selectGabarit = null;
    this.installation.selectFamily = null;
    this.installation.selectLanguage = null;
    this.installation.deleteGabarit = null;

    this.osInstallService.getTemplates(this.serviceName, 'personal')
      .then((templateList) => {
        this.installation.familyType = templateList.family;
        this.installation.distributionList =
          templateList.templates.results;
        this.installation.formatedDistributionList = this.transformData(
          sortBy(this.installation.distributionList,
            'displayName',
          ),
        );
        this.informations.nbDisk = this.installation.server.nbDisk;
        this.installation.nbDiskUse = this.installation.server.nbDisk;
      })
      .catch((error) => {
        this.handleError(
          error,
          this.$translate.instant(
            'server_configuration_installation_ovh_fail_os',
            { t0: this.serviceName },
          ),
        );
      })
      .finally(() => {
        this.loader.loading = false;
      });
  };

  setSelectGabarit(gabarit) {
    this.installation.selectGabarit = gabarit;
    this.installation.selectLanguage =
      this.installation.selectGabarit.defaultLanguage;
    this.initializeOptions();
  };

  clearErrorPersonalTemplate() {
    this.errorGab.ws = null;
  };

  getDisks(disks) {
    if (disks && disks[0].indexOf('[') > -1) {
      return flatten(
        map(disks, (_elem) => {
          const elem = _elem.replace(/\[|\]/g, '');
          return elem.split(',');
        }),
      );
    }
    return disks;
  }

  // call after select gabarit
  loadStep2() {
    this.clearErrorPersonalTemplate();
    let tempHardwareRaid;
    this.loader.loadingHardwareRaidDetails = true;
    this.informations.hardwareRaid = null;
    this.informations.hardwareRaidCompatible = true;
    this.installation.options = {
      saveGabarit: false,
      gabaritNameSave: null,
      changeLog: this.installation.selectGabarit.changeLog,
      customHostname: this.installation.selectGabarit.customHostname,
      postInstallationScriptLink:
        this.installation.selectGabarit.postInstallationScriptLink,
      postInstallationScriptReturn:
        this.installation.selectGabarit.postInstallationScriptReturn,
      sshKeyName: this.installation.selectGabarit.sshKeyName,
      useDistributionKernel:
        this.installation.selectGabarit.useDistributionKernel,
      installSqlServer: false,
      useSpla: false,
      validForm: true,
    };

    this.osInstallService.getHighestPriorityPartitionScheme(
      this.serviceName,
      this.installation.selectGabarit.id,
    )
      .then((response) => {
        return this.osInstallService.getPartitionSchemeHardwareRaid(
          this.serviceName,
          this.installation.selectGabarit.id,
          response.name,
        );
      })
      .then((response) => {
        if (response) {
          tempHardwareRaid = response;
          return this.osInstallService.getHardwareRaidProfile(this.serviceName);
        }
        return null;
      })
      .catch((error) => {
        if (Utils.isHardRaidLocationError(error)) {
          this.errorGab.ws = this.$translate.instant(
            'server_configuration_installation_ovh_step1_hardwareRaid_wrong_location',
          );
          this.informations.hardwareRaidCompatible = false;
        } else if (Utils.isHardRaidUnavailableError(error)) {
          this.errorGab.ws = this.$translate.instant(
            'server_configuration_installation_gabarit_step2_hardwareRaid_incompatible_noHardwareRaid',
          );
          this.informations.hardwareRaidCompatible = false;
        } else {
          this.$q.reject(error);
        }
      })
      .then(() => {
        if (tempHardwareRaid) {
          this.informations.hardwareRaid = tempHardwareRaid;
          if (!this.installation.server.raidController) {
            this.errorGab.ws = this.$translate.instant(
              'server_configuration_installation_gabarit_step2_hardwareRaid_incompatible_noHardwareRaid',
            );
            this.informations.hardwareRaidCompatible = false;
          } else {
            this.informations.hardwareRaid.disks = this.getDisks(
              this.informations.hardwareRaid.disks,
            );
            if (
              this.installation.server.nbPhysicalDisk <
              this.informations.hardwareRaid.disks.length
            ) {
              this.errorGab.ws = this.$translate.instant(
                'server_configuration_installation_gabarit_step2_hardwareRaid_incompatible_disks',
                {
                  t0: this.installation.server.nbPhysicalDisk,
                  t1: this.informations.hardwareRaid.disks.length,
                },
              );
              this.informations.hardwareRaidCompatible = false;
            }
          }
        }
      })
      .catch((error) => {
        this.handleError(
          error,
          this.$translate.instant(
            'server_configuration_installation_ovh_fail_partition_schemes',
            { t0: this.serviceName },
          ),
        );
      })
      .finally(() => {
        this.loader.loadingHardwareRaidDetails = false;
      });
  };

  onDelete(gabarit) {
    this.installation.deleteGabarit = gabarit;
    this.showDeleteConf = true;
    this.atInternet.trackPage({
      name:
        'dedicated::dedicated::server::system-install::existing-template::delete-template',
      type: 'navigation',
    });
  }

  onDeleteCancel() {
    this.installation.deleteGabarit = null;
    this.showDeleteConf = false;
  }

  deleteGabarit() {
    this.atInternet.trackClick({
      name:
        'dedicated::dedicated::server::system-install::existing-template::delete-template::confirm',
      type: 'action',
    });
    this.loader.deletingGabarit = true;

    this.osInstallService.deleteGabarit(
      this.serviceName,
      this.installation.deleteGabarit.id,
    ).then(() => {
      this.errorGab.delete = null;
      this.handleSuccess(
        this.$translate.instant(
          'server_os_install_gabarit_delete_success',
          {
            gabaritName: this.installation.deleteGabarit.displayName,
          },
        ),
      );
      this.installation.deleteGabarit = null;
      this.load();
    })
    .catch((data) => {
      this.errorGab.delete = this.$translate.instant(
        'server_configuration_installation_gabarit_step1_delete_fail',
        {
          t0: this.installation.deleteGabarit.displayName,
          t1: data.data.message,
        },
      );
      this.handleError(
        error,
        this.errorGab.delete,
      );
    })
    .finally(() => {
      this.showDeleteConf = false;
      this.loader.deletingGabarit = false;
    });
  };

  // ------INSTALL------

  startInstall() {
    this.atInternet.trackClick({
      name:
        'dedicated::dedicated::server::system-install::existing-template::install',
      type: 'action',
    });

    this.loader.isInstalling = true;
    this.osInstallService.startInstallation(
      this.serviceName,
      this.installation.selectGabarit.id,
      {
        language: camelCase(this.installation.selectLanguage),
        customHostname: this.installation.options.customHostname,
        installSqlServer: this.installation.options.installSqlServer,
        postInstallationScriptLink:
          this.installation.options.postInstallationScriptLink,
        postInstallationScriptReturn:
          this.installation.options.postInstallationScriptReturn,
        sshKeyName: this.installation.options.sshKeyName,
        useDistribKernel: this.installation.options.useDistributionKernel,
        useSpla: this.installation.options.useSpla,
        softRaidDevices:
          this.informations.nbDisk > 2 &&
            this.installation.nbDiskUse > 1
            ? this.installation.nbDiskUse
            : null,
        noRaid:
          this.installation.nbDiskUse === 1 &&
          !this.informations.raidController,
      },
    )
      .then((task) => {
        set(task, 'id', task.taskId);
        this.goBack(
          this.$translate.instant('server_os_install_gabarit_success', {
            progressHref: this.installProgressHref
          }),
        );
      })
      .catch((error) => {
        this.errorGab.ws = this.$translate.instant(
          'server_configuration_installation_gabarit_step2_error',
          {
            t0: this.installation.selectGabarit.displayName,
            t1: this.installation.server.name,
            t2: this.installation.selectLanguage,
            t3: error.message || error.data?.message,
          },
        );
        this.handleError(error, this.errorGab.ws);
      })
      .finally(() => {
        this.loader.isInstalling = false;
      });
  }

  install() {
    if (this.installation.options.saveGabarit) {
      this.loader.isInstalling = true;
      this.osInstallService.putSetGabarit(
        this.serviceName,
        this.installation.selectGabarit.id,
        this.installation.options.gabaritNameSave,
        {
          changeLog: this.installation.options.changeLog,
          customHostname: this.installation.options.customHostname,
          postInstallationScriptLink:
            this.installation.options.postInstallationScriptLink,
          postInstallationScriptReturn:
            this.installation.options.postInstallationScriptReturn,
          sshKeyName: this.installation.options.sshKeyName,
          useDistributionKernel:
            this.installation.options.useDistributionKernel,
        },
      ).then(() => {
        this.installation.selectGabarit.displayName = angular.copy(
          this.installation.options.gabaritNameSave,
        );
        this.installation.selectGabarit.id = angular.copy(
          this.installation.options.gabaritNameSave,
        );
        this.startInstall();
      })
      .catch((error) => {
        this.errorGab.ws = this.$translate.instant(
          'server_configuration_installation_error_save',
          { t0: error.data || error.data?.message },
        );
      })
      .finally(() => {
        this.loader.isInstalling = false;
      });
    } else {
      this.startInstall();
    }
  };

  // return range between 1 and nbdisque of server if > 1
  getNbDisqueList(nbdisk) {
    if (nbdisk > 1) {
      return range(1, nbdisk + 1);
    }
    return [nbdisk];
  };

  transformData(templates) {
    const families = {};
    forEach(templates, template => {
      if (!families[template.family]) {
        families[template.family] = {
          name: template.family,
          templates: [],
        };
      }
      const family = families[template.family];
      family.templates.push(template);
    });
    return families;
  }

  goBack(message = false) {
    if (isFunction(this.onGoBack)) {
      this.onGoBack({ message });
    }
  }

  handleError(error, message = null) {
    if (isFunction(this.onError)) {
      this.onError({
        error: { message, data: error }
      });
    }
  }

  handleSuccess(message) {
    if (isFunction(this.onSuccess)) {
      this.onSuccess({
        message
      });
    }
  }
}
