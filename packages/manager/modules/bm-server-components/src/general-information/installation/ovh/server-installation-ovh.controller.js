import moment from 'moment';
import chunk from 'lodash/chunk';
import forEachRight from 'lodash/forEachRight';
import range from 'lodash/range';
import set from 'lodash/set';
import { INPUTS_RULES } from '../../inputs/constants';
import {
  MOUNT_POINTS,
  MAX_MOUNT_POINTS,
  REINSTALL_API_CONSOLE_LINK,
  API_OS_INSTALLATION_DOCUMENTATION_LINK,
} from './server-installation-ovh.constants';

export default class ServerInstallationOvhCtrl {
  /* @ngInject */
  constructor(
    $rootScope,
    $state,
    $scope,
    $q,
    $stateParams,
    $translate,
    atInternet,
    Server,
    $filter,
    Alerter,
    coreConfig,
    ovhFeatureFlipping,
    coreURLBuilder,
  ) {
    this.$rootScope = $rootScope;
    this.$state = $state;
    this.$scope = $scope;
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.Server = Server;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.$filter = $filter;
    this.Alerter = Alerter;
    this.ovhSubsidiary = coreConfig.getUser().ovhSubsidiary;
    this.ovhPlate = coreConfig.getRegion();
    this.ovhFeatureFlipping = ovhFeatureFlipping;
    this.coreURLBuilder = coreURLBuilder;
  }

  $onInit() {
    this.doc = {
      apiOsInstallation:
        API_OS_INSTALLATION_DOCUMENTATION_LINK[this.ovhSubsidiary] ||
        API_OS_INSTALLATION_DOCUMENTATION_LINK.DEFAULT,
      consoleForClipboard:
        REINSTALL_API_CONSOLE_LINK[this.ovhPlate] ||
        REINSTALL_API_CONSOLE_LINK.EU,
    };

    this.statePrefix = this.statePrefix || 'app.dedicated-server.server';
    this.$scope.inputRules = INPUTS_RULES;

    this.$scope.units = {
      model: [
        {
          label: 'MiB',
          value: 1,
        },
        {
          label: 'GiB',
          value: 1024,
        },
        {
          label: 'TiB',
          // eslint-disable-next-line no-restricted-properties
          value: Math.pow(1024, 2),
        },
      ],
    };

    this.$scope.countFilter = [];

    this.$scope.constants = {
      server: angular.copy(this.server),
      user: this.user,

      defaultOsCategory: 'BASIC',

      fileSystemList: null,

      forbiddenMountPoint: [
        '/etc',
        '/bin',
        '/sbin',
        '/dev',
        '/lib',
        '/lib64',
        '/lost+found',
        '/proc',
        '/sys',
      ],

      warningRaid0: 0,
      warningRaid1: 1,
      warningRaid5: 5,
      warningRaid6: 6,
      warningRaid7: 7,
      warningRaid10: 10,
      warningRaid50: 50,
      warningRaid60: 60,
      warningNone: 'none',
      warningSwap: 'swap',
      warningReiserfs: 'reiserfs',
      warningWindows: 'windows',
      warningBoot: '/boot',
      warningRoot: '/',
      warningCwin: 'c:',
      warningNTFS: 'ntfs',
      warningEXT4: 'ext4',
      warningLinux: 'linux',
      warningZFS: 'zfs',

      swapLabel: 'swap',

      minSizePartition: 64, // = 64Mo
      minSizeWindows: 32768, // = 32Go
      minSizeReiserfs: 32, // = 32Mo
      minSizeBoot: 50, // = 50Mo
    };

    this.$scope.installation = {
      hasData: false, // false if no distribution is available
      // STEP1
      desktopType: [],
      familyType: [],
      distributionList: null,
      // warningExistPartition: true if a partition has personnalisation
      // in progress(use if user back in distriction list)
      warningExistPartition: false,

      // STEP1 SELECT
      selectDesktopType: {},
      selectFamily: null,
      selectDistribution: null,
      // saveSelectDistribution : save new distribution if a partition
      // has personnalisation in progress(see setSelectDistribution())
      saveSelectDistribution: null,
      diskGroup: null,
      customInstall: false, // load personnalisation partition screen
      // STEP HARD RAID
      hardwareRaid: {
        controller: null, // RAID controller
        disks: null, // Number of disk on which the RAID will be affected
        raid: null, // The type of RAID
        arrays: null, // Number of array (french: grappe)
        totalSpace: null,
        availableSpace: null,
        error: null,
      },

      // STEP2
      partitionSchemesList: null, // list of available partitions scheme
      // STEP2 SELECT
      selectPartitionScheme: null, // select hight priority partition scheme
      partitionSchemeModels: null, // detail of partitionScheme selected
      storage: [],
      customizations: {},
      nbDiskUse: null, // if nbPhysicalDisk > 2 user can select nb disk to use
      // dirtyPartition: true if variable partition size
      // has been customized(change to false in loadPartition())
      dirtyPartition: true,
      // STEP3
      options: {
        variablePartition: null,
        validForm: true,
      },
      saveSize: null,
    };

    this.$scope.informations = {
      totalSize: 0,
      diskSize: 0,
      // nbDisk: Nb of disk use for partitionning.
      // If server has Raid controller, nbDisk = 1, nbPhysicalDisk = n
      nbDisk: 0,
      nbPhysicalDisk: 0, // Nb physical Disk
      typeDisk: null,
      otherDisk: [],
      gabaritName: null,
      raidController: false,
      hardwareRaid: {
        profile: null, // Profile information of hardware Raid
        availableRaids: [],
        error: {},
        availableDisks: [],
        availableArrays: [],
        mapping: {}, // mapping diskGroupId => (hardwareRaid.profile controller id, hardwareRaid.profile disks)
      },
      remainingSize: 0,
      showAllDisk: false,
      showClipboardMessage: false,
      diskGroups: [],
      softRaidOnlyMirroring: null,
    };

    this.$scope.newPartition = {
      order: 0,
      fileSystem: null,
      mountPoint: null,
      volumeName: null,
      raidLevel: null,
      size: 0,

      display: false,
      hasWarning: false,
      realSize: 0,
    };

    this.$scope.setPartition = {
      save: null,
      delModel: null,
      indexSet: -1,
    };

    this.$scope.buttonControl = {
      displayAddConfirmation: false,
      deleteInProgress: false,
      setInProgress: false,
      addInProgress: false,
    };

    this.$scope.loader = {
      loading: false,
    };

    this.$scope.errorInst = {
      order: false,
      orderFirst: false,
      orderFirstWin: false,
      raid0: false,
      raidLv: false,

      mountPointEmpty: false,
      mountPoint: false,
      mountPoint2: false,
      mountPointUse: false,

      partitionSizeToAdd: false,
      partitionSizeOver: false,
      partitionSize: false,
      partitionSizeMin: false,
      partitionSizeWindows: false,
      partitionSizeReiserfs: false,
      partitionSizeBoot: false,

      ws: false,
      wsinstall: false,
      gabaritName: false,
      copyInstallToClipboard: false,
    };

    this.$scope.configError = {
      raidDiskUse: false,
    };

    this.$scope.warning = {
      raid0: false,
    };

    this.$scope.validation = {
      orderList: [],
      mountPointList: [],
      volumeNameList: [],
      maxOrder: 0,
    };

    this.$scope.bar = {
      progress: [],
      total: 0,
    };

    // If the diskGroup is not the first disk group, we need to disable raid setup if it is enabled.
    this.$scope.$watch('installation.diskGroup', (newValue) => {
      if (newValue) {
        this.$scope.installation.raidSetup = false;
        if (
          Object.keys(this.$scope.informations.hardwareRaid.mapping).length !==
          0
        ) {
          // info is ready
          const controllerId = this.$scope.informations.hardwareRaid.mapping[
            newValue.diskGroupId
          ][0];
          if (controllerId !== null) {
            this.$scope.installation.hardwareRaid.controller = this.$scope.informations.hardwareRaid.profile.controllers[
              controllerId
            ]; // set new controller raid matching new selected diskgroupid
          }
        }
        this.refreshDiskGroupInfos(newValue);
        this.recalculateAvailableRaid(); // will update: installation.hardwareRaid.raid
        this.recalculateAvailableRaidDisks();
      }
    });

    this.$scope.$watch('installation.nbDiskUse', (newValue) => {
      if (this.$scope.installation.partitionSchemeModels) {
        this.validationNbDiskUse(newValue);
      }
    });

    this.$scope.$watch('installation.partitionSchemeModels', () => {
      this.refreshBar();
    });

    // ------ HARDWARE RAID TOOL--------
    this.$scope.$watch('installation.hardwareRaid.controller', () => {
      this.clearHardwareRaidSpace();
      this.recalculateAvailableRaid(); // will update: installation.hardwareRaid.raid
    });

    this.$scope.$watch('installation.hardwareRaid.raid', () => {
      this.clearHardwareRaidSpace();
      this.recalculateAvailableRaidDisks();
      if (this.$scope.informations.hardwareRaid.availableDisks.length === 1) {
        [
          this.$scope.installation.hardwareRaid.disks,
        ] = this.$scope.informations.hardwareRaid.availableDisks;
        this.recalculateAvailableArrays();
      }
      this.hasOnlyOneAvailableArraysDisk();
    });

    this.$scope.$watch('installation.hardwareRaid.disks', () => {
      this.clearHardwareRaidSpace();
      this.recalculateAvailableArrays();
      this.hasOnlyOneAvailableArraysDisk();
    });

    this.$scope.$watch('installation.hardwareRaid.arrays', () => {
      this.recalculateSpace();
      if (
        this.$scope.installation.hardwareRaid.disks &&
        this.$scope.installation.hardwareRaid.arrays
      ) {
        this.$scope.installation.hardwareRaid.error = this.invalidHardRaid();
      }
    });

    this.$scope.$on(
      'dedicated.informations.reinstall.form.update',
      (e, validForm) => {
        this.$scope.installation.options.validForm = validForm;
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

  hasOnlyOneAvailableArraysDisk() {
    if (this.$scope.informations.hardwareRaid.availableArrays.length === 1) {
      [
        this.$scope.installation.hardwareRaid.arrays,
      ] = this.$scope.informations.hardwareRaid.availableArrays;
      this.recalculateSpace();
      if (
        this.$scope.installation.hardwareRaid.disks &&
        this.$scope.installation.hardwareRaid.arrays
      ) {
        this.$scope.installation.hardwareRaid.error = this.invalidHardRaid();
      }
    }
  }

  // ------STEP1------
  loadStep1() {
    this.$scope.loader.loading = true;

    const getHardRaid = this.getHardwareRaid();
    const getOvhTemplates = this.Server.getOvhTemplates(
      this.$stateParams.productId,
    )
      .then((templateList) => {
        templateList.category
          .sort((a, b) => a.localeCompare(b))
          .forEach((currentCategory) => {
            if (
              this.$translate.instant(
                `server_configuration_installation_ovh_desktop_${currentCategory}`,
              ) !==
              `server_configuration_installation_ovh_desktop_${currentCategory}`
            ) {
              this.$scope.installation.desktopType.push({
                id: currentCategory,
                label: this.$translate.instant(
                  `server_configuration_installation_ovh_desktop_${currentCategory}`,
                ),
              });
            } else {
              // translation does not exist
              this.$scope.installation.desktopType.push({
                id: currentCategory,
                label:
                  currentCategory[0].toUpperCase() +
                  currentCategory.slice(1).toLowerCase(),
              });
            }
            if (currentCategory === this.$scope.constants.defaultOsCategory) {
              [
                this.$scope.installation.selectDesktopType,
              ] = this.$scope.installation.desktopType.slice(-1);
            }
          });
        this.$scope.installation.familyType = templateList.family.sort((a, b) =>
          a.localeCompare(b),
        );
        this.$scope.installation.distributionList =
          templateList.templates.results;

        if (
          Object.keys(this.$scope.installation.selectDesktopType).length === 0
        ) {
          [this.$scope.installation.selectDesktopType] =
            this.$scope.installation.desktopType || [];
        }
        this.$scope.installation.selectFamily = this.$scope.constants.warningLinux;
      })
      .catch((data) => {
        this.goBack();
        this.Alerter.alertFromSWS(
          this.$translate.instant(
            'server_configuration_installation_ovh_fail_os',
            { t0: this.$scope.constants.server.name },
          ),
          data.data,
          'server_dashboard_alert',
        );
      });

    this.$q.all([getHardRaid, getOvhTemplates]).finally(() => {
      this.$scope.loader.loading = false;
    });
  }

  getCountFilter(itemFamily) {
    const tab = this.$filter('filter')(
      this.$scope.installation.distributionList,
      {
        family: itemFamily,
        category: this.$scope.installation.selectDesktopType.id,
      },
    );
    this.$scope.countFilter[itemFamily] = tab.length;
    if (this.$scope.countFilter[itemFamily] > 0) {
      this.$scope.installation.hasData = true;
    }

    return tab;
  }

  resetDiskGroup() {
    [this.$scope.installation.diskGroup] =
      this.$scope.informations.diskGroups || [];
  }

  getHardwareSpecification() {
    return this.Server.getHardwareSpecifications(
      this.$stateParams.productId,
    ).then((spec) => {
      this.$scope.informations.diskGroups =
        spec.diskGroups?.filter(
          (diskGroup) => diskGroup.raidController !== 'cache',
        ) || [];
      this.resetDiskGroup();
    });
  }

  setSelectDistribution(distribution, bypass) {
    this.$scope.installation.noPartitioning = distribution?.noPartitioning;
    if (distribution?.noPartitioning) {
      this.$scope.installation.customInstall = false;
      this.$scope.installation.nbDiskUse = 1;
    }

    this.$scope.installation.inputs = distribution?.inputs;

    // if saveSelectDistribution is not null, a partition has personnalisation
    // in progress and confirmation to delete is already display
    if (this.$scope.installation.saveSelectDistribution && !bypass) {
      this.$scope.installation.saveSelectDistribution = distribution;
    } else if (
      !this.$scope.installation.saveSelectDistribution &&
      this.$scope.installation.partitionSchemeModels
    ) {
      // a partition has personnalisation in progress beacause partitionSchemeModels is not null
      this.$scope.installation.warningExistPartition = true; // confirmation to delete display
      this.$scope.installation.saveSelectDistribution = distribution; // save new (futur?) distribution
    } else {
      // No partition is currently in personnalisation or confirmation
      // to delete currently partitions(bypass = true)
      this.$scope.installation.warningExistPartition = false;
      this.$scope.installation.partitionSchemeModels = null;

      this.$scope.installation.selectDistribution = distribution;

      if (!distribution) {
        this.resetDiskGroup();
      }

      this.$scope.installation.saveSelectDistribution = null;
      this.$scope.informations.gabaritName = null;
    }
  }

  cancelSetSelectDistribution() {
    this.$scope.installation.warningExistPartition = false;
    this.$scope.installation.saveSelectDistribution = null;
  }

  // ------STEP Hard Raid------

  generateHardwareRaidControllersMapping() {
    const mapping = {};
    this.$scope.informations.diskGroups.forEach((diskGroup) => {
      if (diskGroup.raidController === null) {
        mapping[diskGroup.diskGroupId] = [null, null];
      } else {
        this.$scope.informations.hardwareRaid.profile.controllers.forEach(
          (controller, controllerId) => {
            for (
              let controllerArrayId = 0;
              controllerArrayId < controller.disks.length;
              controllerArrayId += 1
            ) {
              if (
                diskGroup.diskGroupId ===
                controller.disks[controllerArrayId].diskGroupId
              ) {
                // same characteristics, we have the mapping diskGroupId => (hardwareRaid.profile controller id, hardwareRaid.profile disks)
                mapping[diskGroup.diskGroupId] = [
                  controllerId,
                  controllerArrayId,
                ];
                controllerArrayId = controller.disks.length; // we have found what we want we can exit here
              }
            }
          },
        );
      }
    });
    this.$scope.informations.hardwareRaid.mapping = mapping;
  }

  getHardwareRaidProfile() {
    return this.Server.getHardwareRaidProfile(this.$stateParams.productId).then(
      (raidProfile) => {
        this.$scope.informations.hardwareRaid.profile = raidProfile;
        this.generateHardwareRaidControllersMapping();
        const controllerId = this.$scope.informations.hardwareRaid.mapping[
          this.$scope.installation.diskGroup.diskGroupId
        ][0];
        if (controllerId !== null) {
          this.$scope.installation.hardwareRaid.controller =
            raidProfile.controllers[controllerId];
        }
      },
    );
  }

  getHardwareRaid() {
    this.$scope.loader.loading = true;
    return this.getHardwareSpecification()
      .then(() => {
        if (
          this.$scope.informations.diskGroups.some(
            (diskGroup) => diskGroup.raidController !== null,
          )
        ) {
          // we only run this function if there is a HW raid controller otherwise API call will fail
          this.getHardwareRaidProfile();
        }
      })
      .catch((error) => {
        this.goBack();
        this.Alerter.alertFromSWS(
          this.$translate.instant(
            'server_configuration_installation_ovh_stephardraid_loading_error',
          ),
          error.data,
          'server_dashboard_alert',
        );
      });
  }

  // Delete all Error message after cancel action
  clearError() {
    Object.entries(this.$scope.warning).forEach((value, key) => {
      this.$scope.warning[key] = false;
    });
    Object.entries(this.$scope.errorInst).forEach((value, key) => {
      this.$scope.errorInst[key] = false;
    });
  }

  // get real use size for partition with 0 in size (in fact remaining size)
  getRealRemainingSize(raidLevel) {
    const remainingSize = this.getRemainingSize();
    let realRemainingSize = 0;

    if (!Number.isNaN(remainingSize)) {
      if (
        this.$scope.installation.nbDiskUse === 1 ||
        this.$scope.informations.raidController
      ) {
        realRemainingSize = remainingSize;
      } else {
        switch (raidLevel) {
          case this.$scope.constants.warningRaid0:
            realRemainingSize = remainingSize;
            break;
          case this.$scope.constants.warningRaid1:
            realRemainingSize =
              remainingSize / this.$scope.installation.nbDiskUse;
            break;
          case this.$scope.constants.warningRaid5:
            realRemainingSize =
              remainingSize -
              remainingSize / this.$scope.installation.nbDiskUse;
            break;
          case this.$scope.constants.warningRaid6:
            realRemainingSize =
              remainingSize -
              (remainingSize / this.$scope.installation.nbDiskUse) * 2;
            break;
          case this.$scope.constants.warningRaid7:
            realRemainingSize =
              remainingSize -
              (remainingSize / this.$scope.installation.nbDiskUse) * 3;
            break;
          case this.$scope.constants.warningRaid10:
            realRemainingSize = remainingSize / ( this.$scope.installation.nbDiskUse / ( this.$scope.installation.nbDiskUse / 2 ));
            break;
          default:
            break;
        }
      }
    }

    return Math.floor(realRemainingSize);
  }

  showPartition() {
    if (this.$scope.installation.selectPartitionScheme === null) {
      // Select hight priority partition scheme
      [
        this.$scope.installation.selectPartitionScheme,
      ] = this.$scope.installation.partitionSchemesList;
    }

    // Get Partition list of largest partition scheme
    this.Server.getOvhPartitionSchemesTemplatesDetail(
      this.$scope.informations.gabaritName,
      this.$scope.installation.selectPartitionScheme,
    ).then(
      (partitionSchemeModels) => {
        this.$scope.loader.loading = false;
        this.$scope.installation.partitionSchemeModels =
          partitionSchemeModels.partitions;

        for (
          let partitionId = 0;
          partitionId < this.$scope.installation.partitionSchemeModels.length;
          partitionId += 1
        ) {
          // this is an adaptation to minimize changes due to removal of order attribute in 2API call
          set(
            this.$scope.installation.partitionSchemeModels[partitionId],
            'order',
            angular.copy(partitionId + 1),
          );

          // rename order by orderTable
          set(
            this.$scope.installation.partitionSchemeModels[partitionId],
            'orderTable',
            angular.copy(partitionId + 1),
          );
        }

        // if one partition has size = 0 => replace by remaining size
        let hasEmptyPartitionSize = false;

        forEachRight(
          partitionSchemeModels.partitions,
          (partitionSchemeModel, partitionIndex) => {
            if (!hasEmptyPartitionSize) {
              set(
                this.$scope.installation.partitionSchemeModels[partitionIndex],
                'hasWarning',
                false,
              );

              if (
                this.$scope.installation.partitionSchemeModels[partitionIndex]
                  ?.size === 0
              ) {
                set(
                  this.$scope.installation.partitionSchemeModels[
                    partitionIndex
                  ],
                  'size',
                  this.getRealRemainingSize(
                    this.$scope.installation.partitionSchemeModels[
                      partitionIndex
                    ].raidLevel,
                  ),
                );

                // To save information if user change nb disque
                // installation and personnalisation is not dirty
                set(
                  partitionSchemeModels[partitionIndex],
                  'isRemainingSizePartition',
                  true,
                );
                this.$scope.installation.dirtyPartition = false;
                hasEmptyPartitionSize = true;
              }
            }
          },
        );

        // for refresh progress bar
        this.getRemainingSize();
      },
      (data) => {
        this.$scope.loader.loading = false;
        this.goBack();
        set(data, 'type', 'ERROR');
        this.$scope.setMessage(
          this.$translate.instant(
            'server_configuration_installation_ovh_fail_partition_schemes',
            { t0: this.$scope.constants.server.name },
          ),
          data.data,
        );
      },
    );
  }

  // ------STEP2------
  loadPartition() {
    this.$scope.informations.softRaidOnlyMirroring = null;
    this.$scope.loader.loading = true;

    // init
    this.$scope.newPartition.display = false;
    this.$scope.setPartition.save = null;
    this.$scope.setPartition.indexSet = -1;
    this.$scope.setPartition.delModel = null;
    this.clearError();

    this.$scope.installation.partitionSchemesList = this.$scope.installation.selectDistribution.schemeNames;
    this.$scope.informations.gabaritName = this.$scope.installation.selectDistribution.id;
    this.$scope.constants.fileSystemList = this.$scope.installation.selectDistribution.filesystems;
    this.$scope.informations.softRaidOnlyMirroring = this.$scope.installation.selectDistribution.softRaidOnlyMirroring;

    if (this.$scope.installation.partitionSchemesList.length > 0) {
      this.showPartition();
    }
  }

  static toBytes(size) {
    let multiplicator = 1;
    switch (size.unit) {
      case 'KB':
        multiplicator = 1000;
        break;
      case 'MB':
        // eslint-disable-next-line no-restricted-properties
        multiplicator = Math.pow(1000, 2);
        break;
      case 'GB':
        // eslint-disable-next-line no-restricted-properties
        multiplicator = Math.pow(1000, 3);
        break;
      case 'TB':
        // eslint-disable-next-line no-restricted-properties
        multiplicator = Math.pow(1000, 4);
        break;
      case 'PB':
        // eslint-disable-next-line no-restricted-properties
        multiplicator = Math.pow(1000, 5);
        break;
      case 'EB':
        // eslint-disable-next-line no-restricted-properties
        multiplicator = Math.pow(1000, 6);
        break;
      case 'YB':
        // eslint-disable-next-line no-restricted-properties
        multiplicator = Math.pow(1000, 7);
        break;
      default:
        break;
    }
    return size.value * multiplicator;
  }

  refreshDiskGroupInfos(newDiskGroup) {
    this.$scope.informations.raidController =
      newDiskGroup.raidController !== null;
    this.$scope.informations.typeDisk = newDiskGroup.diskType;
    this.$scope.informations.nbPhysicalDisk = newDiskGroup.numberOfDisks;
    this.$scope.informations.diskSize = Math.round(
      ServerInstallationOvhCtrl.toBytes(newDiskGroup.diskSize) / 1024 / 1024,
    );
    this.$scope.informations.nbDisk =
      newDiskGroup.raidController !== null ? 1 : newDiskGroup.numberOfDisks;
    this.$scope.installation.nbDiskUse = this.$scope.informations.nbDisk;

    if (this.$scope.installation.hardwareRaid.availableSpace) {
      this.$scope.informations.totalSize = this.$scope.installation.hardwareRaid.availableSpace;
    } else {
      this.$scope.informations.totalSize =
        newDiskGroup.raidController !== null
          ? Math.round(
              ServerInstallationOvhCtrl.toBytes(newDiskGroup.diskSize) /
                1024 /
                1024,
            )
          : Math.round(
              ServerInstallationOvhCtrl.toBytes(newDiskGroup.diskSize) /
                1024 /
                1024,
            ) * newDiskGroup?.numberOfDisks || 0;
    }

    const otherDisk = this.$scope.informations.diskGroups.find(
      (diskGroup) => diskGroup.diskGroupId !== newDiskGroup.diskGroupId,
    );

    this.$scope.informations.otherDisk = otherDisk
      ? [
          {
            typeDisk: otherDisk.diskType,
            nbDisk: otherDisk.numberOfDisks,
            sizeDisk: Math.round(
              ServerInstallationOvhCtrl.toBytes(otherDisk.diskSize) /
                1024 /
                1024,
            ),
          },
        ]
      : [];
  }

  validationNbDiskUse(nbDisk) {
    let indexVarPartition = null;
    const raidList = this.getRaidList(nbDisk);

    this.$scope.configError.raidDiskUse = false;

    if (nbDisk !== 1) {
      forEachRight(
        this.$scope.installation.partitionSchemeModels,
        (partitionSchemeModel, partitionSchemeModelIndex) => {
          if (
            !this.$scope.installation.dirtyPartition &&
            indexVarPartition === null &&
            partitionSchemeModel?.isRemainingSizePartition
          ) {
            indexVarPartition = partitionSchemeModelIndex;
          }

          if (
            this.$scope.informations.nbDisk > 2 &&
            !raidList.includes(partitionSchemeModel.raidLevel)
          ) {
            this.$scope.configError.raidDiskUse = true;
            set(partitionSchemeModel, 'hasWarning', true);
          } else {
            set(partitionSchemeModel, 'hasWarning', false);
          }
        },
      );
    }

    if (!this.$scope.installation.hardwareRaid.raid) {
      this.$scope.informations.totalSize =
        this.$scope.informations.diskSize * this.$scope.installation.nbDiskUse;
    }

    if (!this.$scope.configError.raidDiskUse && indexVarPartition !== null) {
      this.$scope.installation.partitionSchemeModels[
        indexVarPartition
      ].size = 0;
      this.$scope.installation.partitionSchemeModels[
        indexVarPartition
      ].size = this.getRealRemainingSize(
        this.$scope.installation.partitionSchemeModels[indexVarPartition].raidLevel,
      );
    }

    this.getRemainingSize();
  }

  // ------VALIDATION TOOLS------
  // Create table of boolean with key = the propertie and value = true
  // because this propertie is already use
  updateNoAllowProperties(excludedPartition) {
    this.$scope.validation.orderList = [];
    this.$scope.validation.mountPointList = [];
    this.$scope.validation.volumeNameList = [];
    this.$scope.validation.maxOrder = 0;
    this.$scope.installation.partitionSchemeModels.forEach((partition) => {
      if (this.$scope.validation.maxOrder < partition.order) {
        this.$scope.validation.maxOrder = partition.order;
      }
      if (!excludedPartition || excludedPartition.order !== partition.order) {
        this.$scope.validation.orderList[partition.order] = true;
      }
      if (
        !excludedPartition ||
        excludedPartition.mountPoint !== partition.mountPoint
      ) {
        this.$scope.validation.mountPointList[
          partition.mountPoint.toLowerCase()
        ] = true;
      }
      if (
        partition.volumeName &&
        (!excludedPartition ||
          excludedPartition.volumeName !== partition.volumeName)
      ) {
        this.$scope.validation.volumeNameList[
          partition.volumeName.toLowerCase()
        ] = true;
      }
    });
  }

  // ------END VALIDATION TOOLS------

  // ------Add partition------

  isMountPointAlreadyUsed(newMountPoint) {
    return this.$scope.installation.partitionSchemeModels.some(
      (partition) => partition.mountPoint === newMountPoint,
    );
  }

  getRandomMountPoint() {
    // mountpoint character will be within c and z alphabet and there can be maximum 24 partitions and a will get the error
    let index = 0;
    while (index !== MAX_MOUNT_POINTS) {
      const newMountPoint = `${MOUNT_POINTS.charAt(index)}:`;
      if (this.isMountPointAlreadyUsed(newMountPoint)) {
        index += 1;
      } else {
        return newMountPoint;
      }
    }
    return null;
  }

  displayNewPartition() {
    this.$scope.newPartition.mountPoint = this.$scope.informations
      .softRaidOnlyMirroring
      ? this.getRandomMountPoint()
      : this.$scope.newPartition.mountPoint;
    const raidList = this.getRaidList(this.$scope.installation.nbDiskUse);
    this.clearError();
    this.$scope.newPartition.raidLevel =
      (raidList.length > 0 && raidList[raidList.length - 1]) ||
      this.$scope.constants.warningRaid1;
    this.$scope.newPartition.size = this.getRealRemainingSize(
      this.$scope.newPartition.raidLevel,
    );

    if (
      this.$scope.installation.selectDistribution.family ===
      this.$scope.constants.warningWindows
    ) {
      if (
        this.$scope.constants.fileSystemList.includes(
          this.$scope.constants.warningNTFS,
        )
      ) {
        this.$scope.newPartition.fileSystem = angular.copy(
          this.$scope.constants.warningNTFS,
        );
      } else {
        this.$scope.newPartition.fileSystem = angular.copy(
          this.$scope.constants.fileSystemList[0],
        );
      }
    } else if (
      this.$scope.constants.fileSystemList.includes(
        this.$scope.constants.warningEXT4,
      )
    ) {
      this.$scope.newPartition.fileSystem = angular.copy(
        this.$scope.constants.warningEXT4,
      );
    } else {
      this.$scope.newPartition.fileSystem = angular.copy(
        this.$scope.constants.fileSystemList[0],
      );
    }

    if (
      this.$scope.informations.softRaidOnlyMirroring &&
      this.$scope.newPartition.mountPoint ===
        this.$scope.constants.warningCwin &&
      this.$scope.newPartition.size < this.$scope.constants.minSizeWindows
    ) {
      this.$scope.errorInst.partitionSizeWindows = true;
    } else if (
      this.$scope.newPartition.size < this.$scope.constants.minSizePartition
    ) {
      this.$scope.errorInst.partitionSizeToAdd = true;
    } else {
      this.$scope.newPartition.display = true;
    }
    this.updateNoAllowProperties();
    this.$scope.newPartition.order = this.$scope.validation.maxOrder + 1;
    this.getRemainingSize();
  }

  checkall(partition) {
    this.validationMountPoint(partition);
    this.validationFileSystem(partition);
  }

  isValidPartition() {
    return (
      !this.hasErrorOrder() &&
      !this.hasErrorMountPoint() &&
      !this.hasErrorVolumeName() &&
      !this.hasErrorRaid() &&
      !this.hasErrorSize()
    );
  }

  validAddPartition(bypassRaid) {
    let trueSize = 0;
    this.$scope.buttonControl.addInProgress = true;
    this.checkall(this.$scope.newPartition);
    if (this.isValidPartition()) {
      if (!bypassRaid && this.$scope.warning.raid0) {
        this.$scope.buttonControl.displayAddConfirmation = true;
        this.$scope.buttonControl.addInProgress = false;
      } else {
        trueSize = this.$scope.newPartition.size;
        if (
          this.$scope.newPartition.fileSystem !==
          this.$scope.constants.warningZFS
        ) {
          this.$scope.newPartition.volumeName = null;
        }

        if (
          this.$scope.informations.raidController ||
          this.$scope.informations.nbDisk === 1
        ) {
          this.$scope.newPartition.raidLevel = null;
        }

        this.$scope.warning.raid0 = false;
        this.$scope.newPartition.size = trueSize;
        this.$scope.newPartition.orderTable = angular.copy(
          this.$scope.newPartition.order,
        );
        this.$scope.installation.partitionSchemeModels.push(
          angular.copy(this.$scope.newPartition),
        );

        this.$scope.newPartition.order = null;
        this.$scope.newPartition.fileSystem = null;
        this.$scope.newPartition.mountPoint = null;
        this.$scope.newPartition.volumeName = null;
        this.$scope.newPartition.raidLevel = null;
        this.$scope.newPartition.size = null;

        this.$scope.newPartition.display = false;

        this.$scope.buttonControl.displayAddConfirmation = false;
        this.$scope.buttonControl.addInProgress = false;
        this.clearError();
        this.refreshBar();
        this.validationNbDiskUse(this.$scope.installation.nbDiskUse);
      }
    } else {
      this.$scope.buttonControl.addInProgress = false;
    }
    this.getRemainingSize();
  }

  cancelAddPartition() {
    this.$scope.newPartition.display = false;
    this.getRemainingSize();
    this.clearError();
  }

  // ------Set partition------

  // Get index in partitionSchemeModels table where partition is located
  getIndexOfPartition(partition) {
    return this.$scope.installation.partitionSchemeModels.findLastIndex(
      (partitionSchemeModel) => partitionSchemeModel?.order === partition.order,
    );
  }

  displaySetPartition(partition) {
    // Use index for save what partition is changed
    const index = this.getIndexOfPartition(partition);
    this.clearError();
    this.$scope.setPartition.indexSet = index;
    this.$scope.setPartition.save = angular.copy(
      this.$scope.installation.partitionSchemeModels[index],
    );
    this.updateNoAllowProperties(partition);
    this.getRemainingSize();
  }

  validSetPartition(bypassRaid) {
    const partitionToSet = this.$scope.installation.partitionSchemeModels[
      this.$scope.setPartition.indexSet
    ];
    let trueSize = 0;
    this.$scope.buttonControl.setInProgress = true;
    this.checkall(partitionToSet);
    if (this.isValidPartition()) {
      if (!bypassRaid && this.$scope.warning.raid0) {
        this.$scope.buttonControl.displayAddConfirmation = true;
        this.$scope.buttonControl.setInProgress = false;
      } else {
        trueSize = partitionToSet.size;
        if (
          (!this.$scope.installation.selectDistribution.lvmReady &&
            partitionToSet.fileSystem !== this.$scope.constants.warningZFS) ||
          partitionToSet.fileSystem === this.$scope.constants.warningSwap
        ) {
          partitionToSet.volumeName = null;
        }

        if (partitionToSet.isRemainingSizePartition) {
          this.$scope.installation.dirtyPartition = true;
        }
        this.$scope.warning.raid0 = false;

        partitionToSet.size = trueSize;
        partitionToSet.orderTable = angular.copy(partitionToSet.order);

        this.$scope.setPartition.save = null;
        this.$scope.setPartition.indexSet = -1;

        this.$scope.buttonControl.displayAddConfirmation = false;
        this.$scope.buttonControl.setInProgress = false;
        this.clearError();
        this.validationNbDiskUse(this.$scope.installation.nbDiskUse);
      }
    } else {
      this.$scope.buttonControl.setInProgress = false;
    }
    this.getRemainingSize();
  }

  cancelSetPartition() {
    this.$scope.installation.partitionSchemeModels[
      this.$scope.setPartition.indexSet
    ] = angular.copy(this.$scope.setPartition.save);
    this.$scope.setPartition.save = null;
    this.$scope.setPartition.indexSet = -1;
    this.getRemainingSize();
    this.clearError();
  }

  // ------Delete partition------

  deletePartition(partition) {
    this.$scope.setPartition.delModel = this.getIndexOfPartition(partition);
    this.getRemainingSize();
  }

  deleteValidPartition() {
    this.$scope.buttonControl.deleteInProgress = true;
    if (
      this.$scope.installation.partitionSchemeModels[
        this.$scope.setPartition.delModel
      ].isRemainingSizePartition
    ) {
      this.$scope.installation.dirtyPartition = true;
    }
    this.$scope.installation.partitionSchemeModels.splice(
      this.$scope.setPartition.delModel,
      1,
    );
    this.$scope.setPartition.delModel = null;
    this.getRemainingSize();
    this.$scope.buttonControl.deleteInProgress = false;
    this.clearError();
    this.validationNbDiskUse(this.$scope.installation.nbDiskUse);
  }

  deleteCancelPartition() {
    this.$scope.setPartition.delModel = null;
    this.getRemainingSize();
  }

  // ------Common partition------

  cancelRaid0Partition() {
    this.$scope.buttonControl.displayAddConfirmation = false;
    this.getRemainingSize();
  }

  validPartition() {
    if (
      this.$scope.newPartition.display &&
      !this.$scope.buttonControl.addInProgress
    ) {
      this.validAddPartition(true);
    } else if (
      !this.$scope.buttonControl.setInProgress &&
      this.$scope.setPartition.save
    ) {
      this.validSetPartition(true);
    }
  }

  hasErrorOrder() {
    return (
      this.$scope.errorInst.order ||
      this.$scope.errorInst.orderFirst ||
      this.$scope.errorInst.orderFirstWin
    );
  }

  validationOrder(partition) {
    let firstPartition = partition;
    let hasBoot = false;

    if (!partition.order) {
      if (this.$scope.newPartition.display) {
        set(
          partition,
          'order',
          this.$scope.installation.partitionSchemeModels.length + 1,
        );
      } else {
        set(
          partition,
          'order',
          angular.copy(this.$scope.setPartition.save.order),
        );
      }
    }
    this.$scope.errorInst.order = this.$scope.validation.orderList[
      partition.order
    ];

    if (!this.$scope.errorInst.order) {
      this.$scope.installation.partitionSchemeModels.forEach((partition2) => {
        if (partition2.order < firstPartition.order) {
          firstPartition = partition2;
        }
        if (partition2.mountPoint === this.$scope.constants.warningBoot) {
          hasBoot = true;
        }
      });
      if (this.$scope.newPartition.display) {
        if (partition.mountPoint === this.$scope.constants.warningBoot) {
          hasBoot = true;
        }
      }
      if (
        this.$scope.installation.selectDistribution.family !==
        this.$scope.constants.warningWindows
      ) {
        this.$scope.errorInst.orderFirst =
          (hasBoot &&
            firstPartition.mountPoint !== this.$scope.constants.warningBoot) ||
          (!hasBoot &&
            firstPartition.mountPoint !== this.$scope.constants.warningRoot &&
            firstPartition.mountPoint !== this.$scope.constants.warningBoot);
      } else {
        this.$scope.errorInst.orderFirstWin =
          firstPartition.mountPoint !== this.$scope.constants.warningCwin;
      }
    }
  }

  // ------FILE SYSTEM VALIDATION------

  validationFileSystem(partition) {
    if (partition.fileSystem === this.$scope.constants.warningSwap) {
      set(partition, 'mountPoint', this.$scope.constants.swapLabel);
    }
    this.validationSize(partition);
  }

  // ------MOUNT POINT VALIDATION------

  hasErrorMountPoint() {
    return (
      this.$scope.errorInst.mountPointUse ||
      this.$scope.errorInst.mountPointEmpty ||
      this.$scope.errorInst.mountPoint ||
      this.$scope.errorInst.mountPoint2 ||
      this.$scope.errorInst.mountPointWindows ||
      this.$scope.errorInst.orderFirst ||
      this.$scope.errorInst.orderFirstWin
    );
  }

  validationMountPoint(partition) {
    this.$scope.errorInst.mountPointEmpty = !partition.mountPoint;
    this.$scope.errorInst.mountPointUse =
      !this.$scope.errorInst.mountPointEmpty &&
      this.$scope.validation.mountPointList[partition.mountPoint.toLowerCase()];

    if (partition.fileSystem !== this.$scope.constants.warningSwap) {
      if (
        this.$scope.installation.selectDistribution.family !==
        this.$scope.constants.warningWindows
      ) {
        this.$scope.errorInst.mountPoint =
          !this.$scope.errorInst.mountPointEmpty &&
          !this.$scope.errorInst.mountPointUse &&
          (!!~this.$scope.constants.forbiddenMountPoint.indexOf(
            partition.mountPoint.toLowerCase(),
          ) ||
          /\/\.{1,2}(\/|$)/.test(partition.mountPoint) || // /../
          /\/-/.test(partition.mountPoint) || // /-
          /\/\//.test(partition.mountPoint) || // //
            !/^\/[A-Za-z0-9._\-/]{0,254}$/.test(partition.mountPoint));

        this.$scope.errorInst.mountPoint2 =
          !this.$scope.errorInst.mountPointEmpty &&
          !this.$scope.errorInst.mountPointUse &&
          !this.$scope.errorInst.mountPoint &&
          /^\/var\/log/.test(partition.mountPoint.toLowerCase()) &&
          /^(ovh|gentoo-ovh_64|gentoo-ovh)$/.test(
            this.$scope.installation.selectDistribution.family,
          );
      } else {
        this.$scope.errorInst.mountPointWindows =
          !this.$scope.errorInst.mountPointEmpty &&
          !this.$scope.errorInst.mountPointUse &&
          !/^[c-z]:$/.test(partition.mountPoint.toLowerCase()) &&
          !(
            Object.keys(this.$scope.validation.mountPointList).length ===
            MAX_MOUNT_POINTS
          );
      }
    } else {
      this.$scope.errorInst.mountPoint = false;
      this.$scope.errorInst.mountPoint2 = false;
      this.$scope.errorInst.mountPointWindows = false;
    }
    this.validationOrder(partition);
  }

  // ------VOLUME NAME VALIDATION------

  hasErrorVolumeName() {
    return this.$scope.errorInst.volumeNameEmpty;
  }

  // ------Soft RAID VALIDATION------

  hasErrorRaid() {
    return this.$scope.errorInst.raid0;
  }

  validationRaid(partition) {
    if (partition.fileSystem === this.$scope.constants.warningSwap) {
      set(partition, 'raidLevel', this.$scope.constants.warningRaid1);
    }
    if (
      this.$scope.installation.nbDiskUse > 1 &&
      !this.$scope.informations.raidController
    ) {
      this.$scope.warning.raid0 =
        !this.$scope.errorInst.raid0 &&
        partition.raidLevel === this.$scope.constants.warningRaid0;
    }
    this.validationSize(partition);
  }

  // ------SIZE VALIDATION------

  hasErrorSize() {
    return (
      this.$scope.errorInst.partitionSizeOver ||
      this.$scope.errorInst.partitionSize ||
      this.$scope.errorInst.partitionSizeBoot ||
      this.$scope.errorInst.partitionSizeReiserfs ||
      this.$scope.errorInst.partitionSizeWindows ||
      this.$scope.errorInst.partitionSizeMin ||
      this.$scope.errorInst.partitionSizeRequired
    );
  }

  // boot size < 50Mo = error
  validationSizeBoot(partition, realDisplaySize) {
    this.$scope.errorInst.partitionSizeBoot =
      partition.mountPoint === this.$scope.constants.warningBoot &&
      realDisplaySize < this.$scope.constants.minSizeBoot;
    return this.$scope.errorInst.partitionSizeBoot;
  }

  // reiserfs size < 32Mo = error
  validationSizeReiserfs(partition, realDisplaySize) {
    this.$scope.errorInst.partitionSizeReiserfs =
      partition.fileSystem === this.$scope.constants.warningReiserfs &&
      realDisplaySize < this.$scope.constants.minSizeReiserfs;
    return this.$scope.errorInst.partitionSizeReiserfs;
  }

  // windows size < 20Go = error
  validationSizeWindowsMin(partition, realDisplaySize) {
    this.$scope.errorInst.partitionSizeWindows =
      this.$scope.informations.softRaidOnlyMirroring &&
      partition.mountPoint === this.$scope.constants.warningCwin &&
      realDisplaySize < this.$scope.constants.minSizeWindows;
    return this.$scope.errorInst.partitionSizeWindows;
  }

  // partition size < 10Mo = error
  validationSizeMin(partition, realDisplaySize) {
    this.$scope.errorInst.partitionSizeMin =
      realDisplaySize < this.$scope.constants.minSizePartition;
    return this.$scope.errorInst.partitionSizeMin;
  }

  validationSize(partition) {
    if (partition.size) {
      set(
        partition,
        'size',
        parseInt(partition.size.toString().replace('.', ''), 10),
      );
    }
    this.$scope.errorInst.partitionSizeRequired = !/^[0-9]{1,20}$/.test(
      partition.size,
    );

    this.getRemainingSize();

    const realDisplaySize = this.getRealDisplaySize({
      partition,
      notDisplay: true,
      noRaid: true,
    });

    return (
      this.$scope.errorInst.partitionSizeOver ||
      this.validationSizeBoot(partition, realDisplaySize) ||
      this.validationSizeReiserfs(partition, realDisplaySize) ||
      this.validationSizeWindowsMin(partition, realDisplaySize) ||
      this.validationSizeMin(partition, realDisplaySize)
    );
  }

  // ------END VALIDATION------

  // ------TOOLS------

  // return range between 1 and nbdisque of server if > 1
  getNbDisqueList(nbdisk) {
    if (nbdisk > 1 && !this.$scope.informations.softRaidOnlyMirroring) {
      return range(1, nbdisk + 1);
    }
    if (nbdisk > 1 && this.$scope.informations.softRaidOnlyMirroring) {
      // For softRaidOnlyMirroring: Disks used for installation list should be limited to 2
      this.$scope.informations.nbDisk =
        this.$scope.informations.nbDisk > 2
          ? 2
          : this.$scope.informations.nbDisk;
      this.$scope.installation.nbDiskUse =
        this.$scope.installation.nbDiskUse === 1
          ? this.$scope.installation.nbDiskUse
          : 2;
      this.$scope.informations.totalSize =
        this.$scope.informations.diskSize * this.$scope.installation.nbDiskUse;
      return range(1, 3);
    }
    return [nbdisk];
  }

  // return list of available raid
  getRaidList(nbDisk) {
    const raidList = [0];
    if (nbDisk === null || this.$scope.constants.raidList === null) {
      return raidList;
    }
    if (nbDisk >= 2) {
      raidList.push(1);
    }
    if (nbDisk >= 3) {
      raidList.push(5);
    }
    if (nbDisk >= 5) {
      raidList.push(6);
    }
    if (nbDisk >= 7) {
      raidList.push(7);
    }
    if (nbDisk >= 4 && nbDisk % 2 === 0) {
      raidList.push(10);
    }
    return raidList;
  }

  // Reture true if partition is in edit mode
  isSetPartition(partition) {
    return (
      this.$scope.installation.partitionSchemeModels[
        this.$scope.setPartition.indexSet
      ] === partition
    );
  }

  getEndOfLifeMessage(distribution) {
    // decoding &#34; codes to '"' by using replace
    return `
              ${this.$translate.instant(
                'dedicated_servers_installation_template_wizard_prefix_message',
              )}
              ${this.$filter('date')(distribution.endOfInstall, 'mediumDate')}
              ${this.$translate.instant(
                'dedicated_servers_installation_ovhcloud_template_wizard_message',
                {
                  osDescription: distribution.description,
                },
              )}`.replaceAll(/&#34;/g, '"');
  }

  getDocumentationMessage(distribution) {
    // decoding &#34; codes to '"' by using replace
    let translateString =
      'server_configuration_installation_ovh_step1_doc_tooltip_os';
    if (distribution.project.usage && distribution.project.usage.url) {
      translateString =
        'server_configuration_installation_ovh_step1_doc_tooltip_app';
    }
    return `
              ${this.$translate.instant(translateString, {
                t0: distribution.description,
              })}`.replaceAll(/&#34;/g, '"');
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

  // Display size with unit (recursive)
  getDisplaySize(octetsSize, unitIndex = 0) {
    if (!Number.isNaN(octetsSize)) {
      if (
        octetsSize >= 1024 &&
        unitIndex < this.$scope.units.model.length - 1
      ) {
        return this.getDisplaySize(octetsSize / 1024, unitIndex + 1);
      }
      return `${parseFloat(octetsSize).toFixed(1)} ${this.$translate.instant(
        `unit_size_${this.$scope.units.model[unitIndex].label}`,
      )}`;
    }
    return '';
  }

  getFullSize(partition) {
    set(partition, 'size', 0); // important
    set(partition, 'size', this.getRealRemainingSize(partition.raidLevel));
    this.validationSize(partition);
  }

  // Display real space depending on the raid. if setting or adding,
  // {partition, notDisplay, noRaid}
  getRealDisplaySize(option) {
    if (option.partition && option.partition.takeRemainingSpace) {
      return this.getDisplaySize(this.getRemainingSize());
    }
    if (option.partition && !Number.isNaN(option.partition.size)) {
      if (
        option.noRaid ||
        this.$scope.installation.nbDiskUse === 1 ||
        this.$scope.informations.raidController
      ) {
        set(option, 'partition.realSize', option.partition.size);
      } else if (option.partition.raidLevel === this.$scope.constants.warningRaid7) {
        const { nbDiskUse: nbDisks } = this.$scope.installation;
        const nbParityDisks = 3;
        const nbDataDisks = nbDisks - nbParityDisks;
        const realSizeRatio = nbDataDisks / nbDisks;
        set(
          option,
          'partition.realSize',
          option.partition.size / realSizeRatio,
        );
      } else if (option.partition.raidLevel) {
        switch (option.partition.raidLevel) {
          case this.$scope.constants.warningRaid0:
            set(option, 'partition.realSize', option.partition.size);
            break;
          case this.$scope.constants.warningRaid1:
            set(
              option,
              'partition.realSize',
              option.partition.size * this.$scope.installation.nbDiskUse,
            );
            break;
          case this.$scope.constants.warningRaid5:
            set(
              option,
              'partition.realSize',
              option.partition.size +
                option.partition.size /
                  (this.$scope.installation.nbDiskUse - 1),
            );
            break;
          case this.$scope.constants.warningRaid6:
            set(
              option,
              'partition.realSize',
              (option.partition.size /
                (this.$scope.installation.nbDiskUse - 2)) *
                this.$scope.installation.nbDiskUse,
            );
            break;
          case this.$scope.constants.warningRaid10:
            set(
              option,
              'partition.realSize',
              option.partition.size * (this.$scope.installation.nbDiskUse / ( this.$scope.installation.nbDiskUse / 2 ) ),
            );
            break;
          default:
            break;
        }
      }
      if (option.notDisplay) {
        return option.partition.realSize;
      }
      return this.getDisplaySize(option.partition.realSize);
    }
    return null;
  }

  // get remaining size
  getRemainingSize() {
    let remainingSize = this.$scope.informations.totalSize;

    // all partition
    this.$scope.installation.partitionSchemeModels.forEach((partition) => {
      if (partition.size) {
        remainingSize -= this.getRealDisplaySize({
          partition,
          notDisplay: true,
        });
      }
    });

    // new partition
    if (
      this.$scope.newPartition.display &&
      !Number.isNaN(this.$scope.newPartition.size)
    ) {
      remainingSize -= this.getRealDisplaySize({
        partition: this.$scope.newPartition,
        notDisplay: true,
      });
    }

    // delete partition
    if (
      this.$scope.setPartition.delModel &&
      this.$scope.installation.partitionSchemeModels[
        this.$scope.setPartition.delModel
      ] &&
      !Number.isNaN(
        this.$scope.installation.partitionSchemeModels[
          this.$scope.setPartition.delModel
        ].size,
      )
    ) {
      remainingSize += this.getRealDisplaySize({
        partition: this.$scope.installation.partitionSchemeModels[
          this.$scope.setPartition.delModel
        ],
        notDisplay: true,
      });
    }

    this.$scope.informations.remainingSize = remainingSize;
    this.$scope.errorInst.partitionSizeOver = false;

    if (remainingSize < 0) {
      this.$scope.errorInst.partitionSizeOver = true;
      this.$scope.informations.remainingSize = 0;
    }
    this.refreshBar();

    return this.$scope.informations.remainingSize;
  }

  getBarWidth(partition) {
    return parseFloat(
      (this.getRealDisplaySize({
        partition,
        notDisplay: true,
      }) *
        100) /
        this.$scope.informations.totalSize,
    ).toFixed(1);
  }

  getProgress(partition) {
    let progress = parseFloat(this.getBarWidth(partition));
    if (this.$scope.bar.total < 100.0) {
      if (progress + this.$scope.bar.total > 100.0) {
        progress = 100.0 - this.$scope.bar.total;
      }
      this.$scope.bar.progress.push({
        partition,
        progressSize: progress,
      });
    }
    this.$scope.bar.total += progress;
  }

  refreshBar() {
    this.$scope.bar.progress = [];
    this.$scope.bar.total = 0;

    angular.forEach(
      this.$scope.installation.partitionSchemeModels,
      (partition) => {
        this.getProgress(partition);
      },
    );
    if (this.$scope.newPartition.display) {
      this.getProgress(this.$scope.newPartition);
    }
  }

  recalculateAvailableRaid() {
    if (this.$scope.installation.hardwareRaid.controller) {
      const controllerArrayId = this.$scope.informations.hardwareRaid.mapping[
        this.$scope.installation.diskGroup.diskGroupId
      ][1];
      if (controllerArrayId === null) {
        return; // selected diskGroup doesn't have any raidController
      }
      const nbOfDisk = this.$scope.installation.hardwareRaid.controller.disks[
        controllerArrayId
      ].names.length;
      this.$scope.installation.hardwareRaid.raid = null;
      this.$scope.informations.hardwareRaid.availableDisks = [];
      this.$scope.informations.hardwareRaid.availableRaids = [];

      for (let i = 1; i < nbOfDisk + 1; i += 1) {
        this.$scope.informations.hardwareRaid.availableDisks.push(i);
      }
      if (nbOfDisk >= 8) {
        this.$scope.informations.hardwareRaid.availableRaids.push(
          this.$scope.constants.warningRaid60,
        );
      }
      if (nbOfDisk >= 7) {
        this.$scope.informations.hardwareRaid.availableRaids.push(
          this.$scope.constants.warningRaid7,
        );
      }
      if (nbOfDisk >= 6) {
        this.$scope.informations.hardwareRaid.availableRaids.push(
          this.$scope.constants.warningRaid50,
        );
      }
      if (nbOfDisk >= 4) {
        this.$scope.informations.hardwareRaid.availableRaids.push(
          this.$scope.constants.warningRaid6,
        );
        this.$scope.informations.hardwareRaid.availableRaids.push(
          this.$scope.constants.warningRaid10,
        );
      }
      if (nbOfDisk >= 3) {
        this.$scope.informations.hardwareRaid.availableRaids.push(
          this.$scope.constants.warningRaid5,
        );
      }
      if (nbOfDisk >= 2) {
        this.$scope.informations.hardwareRaid.availableRaids.push(
          this.$scope.constants.warningRaid1,
        );
        if (!this.$scope.installation.hardwareRaid.raid) {
          this.$scope.installation.hardwareRaid.raid = this.$scope.constants.warningRaid1; // set a default value to be ergonomic
        }
        this.$scope.informations.hardwareRaid.availableRaids.push(
          this.$scope.constants.warningRaid0,
        );
      }
    }
  }

  recalculateAvailableRaidDisks() {
    if (this.$scope.installation.hardwareRaid.controller) {
      const controllerArrayId = this.$scope.informations.hardwareRaid.mapping[
        this.$scope.installation.diskGroup.diskGroupId
      ][1];
      if (controllerArrayId === null) {
        return; // selected diskGroup doesn't have any raidController
      }
      const nbOfDisk = this.$scope.installation.hardwareRaid.controller.disks[
        controllerArrayId
      ].names.length;
      let minDisks = 1;
      let minDisksPerArray = 1;
      this.$scope.informations.hardwareRaid.availableDisks = [];
      this.$scope.installation.hardwareRaid.disks = null;

      switch (this.$scope.installation.hardwareRaid.raid) {
        case this.$scope.constants.warningRaid60:
          minDisks = 8;
          minDisksPerArray = 4;
          break;
        case this.$scope.constants.warningRaid50:
          minDisks = 6;
          minDisksPerArray = 3;
          break;
        case this.$scope.constants.warningRaid10:
          minDisksPerArray = 2;
          minDisks = 4;
          break;
        case this.$scope.constants.warningRaid7:
          minDisks = 7;
          break;
        case this.$scope.constants.warningRaid6:
          minDisks = 4;
          break;
        case this.$scope.constants.warningRaid5:
          minDisks = 3;
          break;
        case this.$scope.constants.warningRaid1:
          minDisks = 2;
          break;
        case this.$scope.constants.warningRaid0:
          minDisks = 2;
          break;
        default:
          minDisks = 1;
      }
      let i = 0;
      for (i = minDisks; i < nbOfDisk + 1; i += minDisksPerArray) {
        this.$scope.informations.hardwareRaid.availableDisks.push(i);
      }
      if (i > minDisks && i - 1 <= nbOfDisk) {
        this.$scope.installation.hardwareRaid.disks = i - 1; // set a default value to be ergonomic
      }
    }
  }

  recalculateAvailableArrays() {
    if (
      this.$scope.installation.hardwareRaid.disks &&
      this.$scope.installation.hardwareRaid.controller
    ) {
      const controllerArrayId = this.$scope.informations.hardwareRaid.mapping[
        this.$scope.installation.diskGroup.diskGroupId
      ][1];
      let maxNumberArray = this.$scope.installation.hardwareRaid.controller
        .disks[controllerArrayId].names.length;
      let minNumberArray = 1;
      let isMultipleArrays = false;
      this.$scope.informations.hardwareRaid.availableArrays = [];
      this.$scope.installation.hardwareRaid.arrays = null;

      switch (this.$scope.installation.hardwareRaid.raid) {
        case this.$scope.constants.warningRaid60:
          maxNumberArray = this.$scope.installation.hardwareRaid.disks / 4;
          minNumberArray = 2;
          isMultipleArrays = true;
          break;
        case this.$scope.constants.warningRaid50:
          maxNumberArray = this.$scope.installation.hardwareRaid.disks / 3;
          minNumberArray = 2;
          isMultipleArrays = true;
          break;
        case this.$scope.constants.warningRaid10:
          maxNumberArray = this.$scope.installation.hardwareRaid.disks / 2;
          minNumberArray = 2;
          isMultipleArrays = true;
          break;
        default:
          break;
      }

      if (isMultipleArrays) {
        for (let i = minNumberArray; i <= maxNumberArray; i += 1) {
          if (this.$scope.installation.hardwareRaid.disks % i === 0) {
            this.$scope.informations.hardwareRaid.availableArrays.push(i);
          }
        }
      } else {
        this.$scope.informations.hardwareRaid.availableArrays = [1];
        this.$scope.installation.hardwareRaid.arrays = 1;
        this.recalculateSpace();
      }
    }
  }

  recalculateSpace() {
    if (
      this.$scope.installation.hardwareRaid.disks &&
      this.$scope.installation.hardwareRaid.arrays &&
      this.$scope.installation.hardwareRaid.controller
    ) {
      const controllerArrayId = this.$scope.informations.hardwareRaid.mapping[
        this.$scope.installation.diskGroup.diskGroupId
      ][1];
      const diskSize = Math.round(
        ServerInstallationOvhCtrl.toBytes(
          this.$scope.installation.hardwareRaid.controller.disks[
            controllerArrayId
          ].capacity,
        ) /
          1024 /
          1024,
      );
      const grappe = this.$scope.installation.hardwareRaid.arrays;
      const nbOfDisks = this.$scope.installation.hardwareRaid.disks;

      this.$scope.installation.hardwareRaid.totalSpace =
        this.$scope.installation.hardwareRaid.disks * diskSize;
      switch (this.$scope.installation.hardwareRaid.raid) {
        case this.$scope.constants.warningRaid60:
          this.$scope.installation.hardwareRaid.availableSpace =
            (nbOfDisks - 2 * grappe) * diskSize;
          break;
        case this.$scope.constants.warningRaid50:
          this.$scope.installation.hardwareRaid.availableSpace =
            (nbOfDisks - grappe) * diskSize;
          break;
        case this.$scope.constants.warningRaid10:
          this.$scope.installation.hardwareRaid.availableSpace =
            grappe * diskSize;
          break;
        case this.$scope.constants.warningRaid7:
          this.$scope.installation.hardwareRaid.availableSpace =
            (nbOfDisks - 3) * diskSize;
          break;
        case this.$scope.constants.warningRaid6:
          this.$scope.installation.hardwareRaid.availableSpace =
            (nbOfDisks - 2) * diskSize;
          break;
        case this.$scope.constants.warningRaid5:
          this.$scope.installation.hardwareRaid.availableSpace =
            (nbOfDisks - 1) * diskSize;
          break;
        case this.$scope.constants.warningRaid1:
          this.$scope.installation.hardwareRaid.availableSpace = diskSize;
          break;
        default:
          this.$scope.installation.hardwareRaid.availableSpace =
            diskSize * nbOfDisks;
      }
      this.$scope.informations.totalSize = this.$scope.installation.hardwareRaid.availableSpace;
    }
  }

  invalidHardRaid() {
    return (
      this.$scope.installation.hardwareRaid.disks %
        this.$scope.installation.hardwareRaid.arrays !==
      0
    );
  }

  clearHardwareRaidSpace() {
    this.$scope.installation.hardwareRaid.availableSpace = null;
    this.$scope.installation.hardwareRaid.totalSpace = null;
  }

  prepareDiskList() {
    const controllerArrayId = this.$scope.informations.hardwareRaid.mapping[
      this.$scope.installation.diskGroup.diskGroupId
    ][1];

    const disksPerArray =
      this.$scope.installation.hardwareRaid.disks /
      this.$scope.installation.hardwareRaid.arrays;
    if (this.$scope.installation.hardwareRaid.arrays === 1) {
      return this.$scope.installation.hardwareRaid.controller.disks[
        controllerArrayId
      ].names.slice(0, this.$scope.installation.hardwareRaid.disks);
    }

    // API expect something like this...:
    // "disks": [
    //    "[c0:d0, c0:d1, c0:d2]",
    //    "[c0:d3, c0:d4, c0:d5]",
    //    "[c0:d6, c0:d7, c0:d8]",
    //    "[c0:d9, c0:d10, c0:d11]"
    // ]
    return chunk(
      this.$scope.installation.hardwareRaid.controller.disks[
        controllerArrayId
      ].names.slice(0, this.$scope.installation.hardwareRaid.disks),
      disksPerArray,
    ).map((elem) => `[${elem.toString()}]`);
  }

  // ------CUSTOME STEP MODAL------

  static extendModal() {
    ServerInstallationOvhCtrl.setSizeModalDialog(true);
  }

  checkNextStep1() {
    this.$scope.informations.nbDisk = this.$scope.installation.diskGroup.numberOfDisks;
    if (!this.$scope.installation.raidSetup) {
      ServerInstallationOvhCtrl.extendModal();
      if (this.$scope.installation.customInstall) {
        this.$rootScope.$broadcast('wizard-goToStep', 3);
      } else {
        this.$rootScope.$broadcast('wizard-goToStep', 4);
      }
    }
  }

  checkNextStep2() {
    ServerInstallationOvhCtrl.extendModal();
    if (!this.$scope.installation.customInstall) {
      this.$rootScope.$broadcast('wizard-goToStep', 4);
    }
  }

  addRemainingSize() {
    const remainingSize = this.getRemainingSize();

    if (
      (this.$scope.constants.minSizePartition > remainingSize &&
        this.$scope.installation.selectDistribution.family !==
          this.$scope.constants.warningWindows) ||
      (this.$scope.constants.minSizeWindows > remainingSize &&
        this.$scope.installation.selectDistribution.family ===
          this.$scope.constants.warningWindows)
    ) {
      this.$scope.installation.partitionSchemeModels.forEach((partition) => {
        if (
          !this.$scope.installation.options.variablePartition ||
          (this.$scope.installation.options.variablePartition.size <
            partition.size &&
            this.$scope.installation.options.variablePartition.size !== 0)
        ) {
          this.$scope.installation.options.variablePartition = partition;
        }
      });
    }
  }

  checkIntegrity() {
    this.$scope.errorInst.ws = null;
    this.$scope.installation.options = {
      variablePartition: null,
      validForm: true,
    };
    this.$scope.installation.userMetadata = [];

    if (
      this.$scope.installation.customInstall &&
      this.$scope.informations.gabaritName
    ) {
      this.addRemainingSize();
    } else {
      this.loadPartition();
    }
  }

  // ------INSTALL------

  saveRemainingSize(_size, stop) {
    let size = _size;

    if (!stop) {
      this.$scope.errorInst.wsinstall = null;
    }
    if (this.$scope.installation.customInstall) {
      // if install fail before start
      if (!size) {
        size = 0;
        if (this.$scope.installation.options.variablePartition) {
          this.$scope.installation.saveSize = this.$scope.installation.options.variablePartition.size;
        }
      }

      // if change variable partition
      this.addRemainingSize();
    }
    if (!stop) {
      this.install();
    }
  }

  startInstall() {
    this.$scope.loader.loading = true;
    this.Server.startInstallation(
      this.$stateParams.productId,
      this.$scope.informations.gabaritName,
      this.$scope.installation.storage,
      this.$scope.installation.customizations,
    ).then(
      (task) => {
        set(task, 'id', task.taskId);
        this.$rootScope.$broadcast('dedicated.informations.reinstall', task);
        this.$state.go(`${this.statePrefix}.dashboard.installation-progress`);
        this.$scope.loader.loading = false;
      },
      (data) => {
        this.saveRemainingSize(this.$scope.installation.saveSize, true);
        this.$scope.errorInst.wsinstall = this.$translate.instant(
          'server_configuration_installation_ovh_step3_error',
          {
            t0: this.$scope.installation.selectDistribution.displayName,
            t1: this.$scope.constants.server.name,
            t2: data.message,
          },
        );
        this.$scope.loader.loading = false;
      },
    );
  }

  getCustomizations() {
    const customizations = {};
    Object.values(this.$scope.installation.inputs).forEach((input) => {
      if (
        input.type !== 'keyValue' &&
        this.$scope.installation.input[input.name]
      ) {
        customizations[input.name.toString()] = this.$scope.installation.input[
          input.name
        ].toString();
      } else if (
        input.type === 'keyValue' &&
        this.$scope.installation.input[input.name].length > 0
      ) {
        customizations[input.name.toString()] = {};
        this.$scope.installation.input[input.name].forEach((keyValueItem) => {
          customizations[input.name.toString()][
            keyValueItem.key.toString()
          ] = keyValueItem.value.toString();
        });
      }
    });
    this.$scope.installation.customizations = customizations;
  }

  getStoragePartitioningLayout() {
    this.$scope.installation.partitionSchemeModels.sort(
      (a, b) => a.order - b.order,
    );
    const layout = [];
    angular.forEach(
      this.$scope.installation.partitionSchemeModels,
      (partition) => {
        const newPartition = {
          fileSystem: partition.fileSystem,
          mountPoint: partition.mountPoint,
          size:
            this.$scope.installation.options.variablePartition &&
            this.$scope.installation.options.variablePartition.mountPoint ===
              partition.mountPoint
              ? 0
              : partition.size,
          raidLevel: partition.raidLevel,
          extras: {},
        };
        if (
          partition.volumeName &&
          this.$scope.installation.selectDistribution.lvmReady &&
          partition.fileSystem !== this.$scope.constants.warningZFS &&
          partition.fileSystem !== this.$scope.constants.warningSwap
        ) {
          newPartition.extras = {
            lv: {
              name: partition.volumeName,
            },
          };
        }
        if (
          partition.volumeName &&
          partition.fileSystem === this.$scope.constants.warningZFS
        ) {
          newPartition.extras = {
            zp: {
              name: partition.volumeName,
            },
          };
        }
        layout.push(newPartition);
      },
    );
    return layout;
  }

  setStorage() {
    const storage = {
      diskGroupId: this.$scope.installation.diskGroup.diskGroupId || null,
      hardwareRaid: [],
      partitioning: {
        disks:
          this.$scope.informations.nbDisk > 1 &&
          this.$scope.installation.nbDiskUse
            ? this.$scope.installation.nbDiskUse
            : 0,
      },
    };
    if (this.$scope.installation.raidSetup) {
      const disks = this.prepareDiskList();
      storage.hardwareRaid.push({
        arrays: this.$scope.installation.hardwareRaid.arrays,
        disks: disks.length,
        raidLevel: this.$scope.installation.hardwareRaid.raid,
      });
    }
    if (this.$scope.installation.customInstall) {
      storage.partitioning.layout = this.getStoragePartitioningLayout();
    } else {
      storage.partitioning.schemeName = this.$scope.installation.selectPartitionScheme;
    }
    this.$scope.installation.storage = [storage];
  }

  install() {
    this.trackClick(
      `dedicated::dedicated::${this.serverType}::system-install::public-catalog::install`,
    );
    this.getCustomizations();
    this.setStorage();
    this.startInstall();
  }

  copyInstallToClipboard() {
    this.getCustomizations();
    this.setStorage();
    this.$scope.informations.showClipboardMessage = true;
    const data = {
      operatingSystem: this.$scope.informations.gabaritName,
      storage: this.$scope.installation.storage,
      customizations: this.$scope.installation.customizations,
    };
    navigator.clipboard
      .writeText(JSON.stringify(data, null, 2))
      .then(() => {
        this.$scope.errorInst.copyInstallToClipboard = false;
      })
      .catch(() => {
        this.$scope.errorInst.copyInstallToClipboard = true;
      });
  }

  hasLicencedOs() {
    return this.$scope.installation.distributionList?.find(
      (distribution) =>
        distribution.family === this.$scope.constants.warningWindows,
    );
  }

  trackClick(name) {
    this.atInternet.trackClick({
      name,
      type: 'action',
    });
  }
}
