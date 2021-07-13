import angular from 'angular';

import chunk from 'lodash/chunk';
import camelCase from 'lodash/camelCase';
import compact from 'lodash/compact';
import find from 'lodash/find';
import findLastIndex from 'lodash/findLastIndex';
import forEachRight from 'lodash/forEachRight';
import get from 'lodash/get';
import head from 'lodash/head';
import includes from 'lodash/includes';
import map from 'lodash/map';
import range from 'lodash/range';
import set from 'lodash/set';
import some from 'lodash/some';
import sortBy from 'lodash/sortBy';
import take from 'lodash/take';
import forEach from 'lodash/forEach';
import isFunction from 'lodash/isFunction';

import Utils from '../utils';

import { RTM_INSTALL_FEATURE, RTM_GUIDE_URLS, CONSTANTS } from './constants';

export default class BmServerComponentsOsInstallOvhCtrl {
  /* @ngInject */
  constructor(
    $http,
    $scope,
    $q,
    $translate,
    atInternet,
    $filter,
    osInstallService,
    ovhFeatureFlipping,
    coreURLBuilder,
  ) {
    this.$http = $http;
    this.$scope = $scope;
    this.$q = $q;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.$filter = $filter;
    this.osInstallService = osInstallService;
    this.ovhFeatureFlipping = ovhFeatureFlipping;

    this.LICENSE_URL = coreURLBuilder.buildURL(
      'dedicated',
      '#/configuration/license',
    );
  }

  $onInit() {
    this.countFilter = [];

    this.constants = {
      server: this.server,
      user: this.user,

      // get by this.osInstallService.getOvhPartitionSchemesTemplates
      raidList: null, // Map[nbDisk, available raid]
      fileSystemList: null,
      partitionTypeList: null,
      ...CONSTANTS,
    };

    this.installation = {
      hasData: false, // false if no distribution is available
      // STEP1
      desktopType: [],
      familyType: [],
      distributionList: null,
      // warningExistPartition: true if a partition has personnalisation
      // in progress(use if user back in distriction list)
      warningExistPartition: false,

      // STEP1 SELECT
      selectDesktopType: null,
      selectFamily: null,
      selectDistribution: null,
      // saveSelectDistribution : save new distribution if a partition
      // has personnalisation in progress(see setSelectDistribution())
      saveSelectDistribution: null,
      selectLanguage: null,
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
      nbDiskUse: null, // if nbPhysicalDisk > 2 user can select nb disk to use
      // dirtyPartition: true if variable partition size
      // has been customized(change to false in loadPartiton())
      dirtyPartition: true,
      // STEP3
      gabaritNameSave: null,
      options: {
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
        variablePartition: null,
        validForm: true,
      },
      variablePartition: false,
      saveSize: null,
      raidSetup: false,
    };

    this.informations = {
      totalSize: 0,
      diskSize: 0,
      // nbDisk: Nb of disk use for partitionning.
      // If server has Raid controller, nbDisk = 1, nbPhysicalDisk = n
      nbDisk: 0,
      nbPhysicalDisk: 0, // Nb physical Disk
      typeDisk: null,
      otherDisk: [],
      gabaritName: null,
      isCachecade: false,
      raidController: false,
      hardwareRaid: {
        profile: null, // Profile information of hardware Raid
        availableRaids: [],
        error: {},
        availableDisks: [],
        availableArrays: [],
      },
      remainingSize: 0,
      showAllDisk: false,
      diskGroups: [],
    };

    this.newPartition = {
      order: 0,
      typePartition: null,
      fileSystem: null,
      mountPoint: null,
      volumeName: null,
      raid: null,
      partitionSize: 0,

      canBeDelete: true,
      display: false,
      hasWarning: false,
      realSize: 0,
    };

    this.setPartition = {
      save: null,
      delModel: null,
      indexSet: -1,
    };

    this.buttonControl = {
      displayAddConfirmation: false,
      deleteInProgress: false,
      setInProgress: false,
      addInProgress: false,
    };

    this.loader = {
      loading: false,
      loadingForm: false,
      loadingCapabilities: false,
    };

    this.errorInst = {
      order: false,
      orderFirst: false,
      orderFirstWin: false,
      fileSystemSwap: false,
      fileSystemNoSwap: false,
      raid0: false,
      raidLv: false,
      orderType: false,
      typeLogicalLv: false,
      typePrimary: false,
      typeLvSwap: false,

      mountPointEmpty: false,
      mountPoint: false,
      mountPoint2: false,
      mountPointUse: false,

      volumeNameEmpty: false,
      volumeName: false,
      volumeNameUse: false,

      partitionSizeToAdd: false,
      partitionSizeOver: false,
      partitionSizeSwap: false,
      partitionSize: false,
      partitionSizeMin: false,
      partitionSizeWindows: false,
      partitionSizeReiserfs: false,
      partitionSizeBoot: false,

      ws: false,
      wsinstall: false,
      gabaritName: false,
    };

    this.configError = {
      raidDiskUse: false,
    };

    this.warning = {
      raid0: false,
    };

    this.validation = {
      orderList: [],
      mountPointList: [],
      volumeNameList: [],
      hasSwap: false,
      maxOrder: 0,
    };

    this.bar = {
      progress: [],
      total: 0,
    };

    this.sshList = [];

    this.rtmGuideLink = get(
      RTM_GUIDE_URLS,
      this.constants.user.ovhSubsidiary,
      get(RTM_GUIDE_URLS, 'GB'),
    );

    this.initWatches();
    this.load();
  }

  trackClick(name) {
    this.atInternet.trackClick({
      name,
      type: 'action',
    });
  }

  initWatches() {
    // If the diskGroup is not the first disk group, we need to disable raid setup if it is enabled.
    this.$scope.$watch(
      () => this.installation.diskGroup,
      (newValue) => {
        if (newValue) {
          if (
            newValue.diskGroupId !==
            get(this.informations.diskGroups[0] || {}, 'diskGroupId')
          ) {
            this.installation.raidSetup = false;
          }
          this.refreshDiskGroupInfos(newValue);
        }
      },
    );

    this.$scope.$watch(
      () => this.installation.nbDiskUse,
      (newValue) => {
        if (this.installation.partitionSchemeModels) {
          this.validationNbDiskUse(newValue);
        }
      },
    );
  }

  // ------STEP1------
  load() {
    this.loader.loading = true;

    const getHardRaid = this.getHardwareRaid();
    const getOvhTemplates = this.osInstallService
      .getTemplates(this.serviceName, 'ovh')
      .then((templateList) => {
        this.installation.desktopType = templateList.category.sort((a, b) =>
          a.localeCompare(b),
        );
        this.installation.familyType = templateList.family;
        this.installation.distributionList = templateList.templates.results;
        this.installation.formatedDistributionList = BmServerComponentsOsInstallOvhCtrl.transformData(
          sortBy(templateList.templates.results, 'displayName'),
        );
        this.installation.selectDesktopType = head(
          this.installation.desktopType,
        );
        this.installation.selectFamily = this.constants.warningLINUX;
      })
      .catch((error) => {
        this.handleError(
          error,
          this.$translate.instant(
            'server_configuration_installation_ovh_fail_os',
            { t0: this.serviceName },
          ),
        );
      });
    const getSshKeys = this.osInstallService
      .getSshKey(this.serviceName)
      .then((data) => {
        this.sshList = data;
      });
    const getRtmInstallAvailability = this.ovhFeatureFlipping
      .checkFeatureAvailability(RTM_INSTALL_FEATURE)
      .then((rtmFeatureResult) => {
        this.isRtmAvailable = rtmFeatureResult.isFeatureAvailable(
          RTM_INSTALL_FEATURE,
        );
      });

    this.$q
      .all([
        getHardRaid,
        getOvhTemplates,
        getSshKeys,
        getRtmInstallAvailability,
      ])
      .finally(() => {
        this.loader.loading = false;
      });
  }

  getCountFilter(itemFamily) {
    const tab = this.$filter('filter')(this.installation.distributionList, {
      family: itemFamily,
      category: this.installation.selectDesktopType,
    });
    this.countFilter[itemFamily] = tab.length;
    if (this.countFilter[itemFamily] > 0) {
      this.installation.hasData = true;
    }

    return tab;
  }

  resetDiskGroup() {
    this.installation.diskGroup = head(this.informations.diskGroups);
  }

  getHardwareSpecification() {
    return this.osInstallService
      .getHardwareSpecifications(this.serviceName)
      .then((spec) => {
        this.informations.diskGroups = spec.diskGroups;
        this.resetDiskGroup();
      });
  }

  setSelectDistribution(distribution, bypass) {
    this.installation.noPartitioning = distribution?.noPartitioning;
    if (distribution?.noPartitioning) {
      this.installation.customInstall = false;
    }
    // if saveSelectDistribution is not null, a partition has personnalisation
    // in progress and confirmation to delete is already display
    if (this.installation.saveSelectDistribution && !bypass) {
      this.installation.saveSelectDistribution = distribution;
    } else if (
      !this.installation.saveSelectDistribution &&
      this.installation.partitionSchemeModels
    ) {
      // a partition has personnalisation in progress beacause partitionSchemeModels is not null
      this.installation.warningExistPartition = true; // confirmation to delete display
      this.installation.saveSelectDistribution = distribution; // save new (futur?) distribution
    } else {
      // No partition is currently in personnalisation or confirmation
      // to delete currently partitions(bypass = true)
      this.installation.warningExistPartition = false;
      this.installation.partitionSchemeModels = null;

      this.installation.isHybridCompatible = false;
      this.installation.selectDistribution = distribution;

      if (distribution) {
        this.loader.loadingCapabilities = true;
        this.osInstallService
          .getTemplateCapabilities(this.serviceName, distribution.id)
          .then((data) => {
            this.installation.isHybridCompatible = data.hybridSupport;
            if (!this.installation.isHybridCompatible) {
              this.resetDiskGroup();
            }
          })
          .finally(() => {
            this.loader.loadingCapabilities = false;
          });

        this.installation.selectLanguage = this.installation.selectDistribution.defaultLanguage;
      } else {
        this.resetDiskGroup();
      }

      this.installation.saveSelectDistribution = null;
      this.informations.gabaritName = null;
    }

    if (this.server.raidController && this.installation.selectDistribution) {
      if (this.installation.selectDistribution.hardRaidConfiguration) {
        this.installation.raidSetup = true;
      } else {
        this.installation.raidSetup = false;
      }
    }
  }

  cancelSetSelectDistribution() {
    this.installation.warningExistPartition = false;
    this.installation.saveSelectDistribution = null;
  }

  // ------STEP Hard Raid------

  getHardwareRaidProfile() {
    return this.osInstallService
      .getHardwareRaidProfile(this.serviceName)
      .then((raidProfile) => {
        this.informations.hardwareRaid.profile = raidProfile;
        if (some(get(raidProfile, 'controllers'))) {
          this.installation.hardwareRaid.controller = head(
            raidProfile.controllers,
          );
        }
      });
  }

  getHardwareRaid() {
    if (!this.informations.hardwareRaid.profile) {
      this.loader.loading = true;
      return this.$q
        .all([this.getHardwareRaidProfile(), this.getHardwareSpecification()])
        .catch((error) => {
          this.informations.hardwareRaid.error.wrongLocation = Utils.isHardRaidLocationError(
            error,
          );
          this.informations.hardwareRaid.error.notAvailable = Utils.isHardRaidUnavailableError(
            error,
          );
          if (
            !this.informations.hardwareRaid.error.wrongLocation &&
            !this.informations.hardwareRaid.error.notAvailable
          ) {
            this.handleError(
              error,
              this.$translate.instant(
                'server_configuration_installation_ovh_stephardraid_loading_error',
              ),
            );
          }
        });
    }
    return this.$q.when({});
  }

  // Delete all Error message after cancel action
  clearError() {
    forEach(this.warning, (value, key) => {
      this.warning[key] = false;
    });
    forEach(this.errorInst, (value, key) => {
      this.errorInst[key] = false;
    });
  }

  // get real use size for partition with 0 in size (in fact remaining size)
  getRealRemainingSize(raid) {
    const remainingSize = this.getRemainingSize();
    let realRemainingSize = 0;

    if (!Number.isNaN(remainingSize)) {
      if (
        this.installation.nbDiskUse === 1 ||
        this.informations.raidController
      ) {
        realRemainingSize = remainingSize;
      } else if (raid) {
        switch (raid) {
          case '_0':
            realRemainingSize = remainingSize;
            break;
          case '_1':
            realRemainingSize = remainingSize / this.installation.nbDiskUse;
            break;
          case '_5':
            realRemainingSize =
              remainingSize - remainingSize / this.installation.nbDiskUse;
            break;
          case '_6':
            realRemainingSize =
              remainingSize - (remainingSize / this.installation.nbDiskUse) * 2;
            break;
          case '_10':
            realRemainingSize =
              remainingSize / (this.installation.nbDiskUse / 2);
            break;
          default:
            break;
        }
      }
    }

    if (
      !this.installation.selectDistribution.supportsGpt &&
      realRemainingSize > this.constants.maxSizePartition
    ) {
      return this.constants.maxSizePartition;
    }

    return realRemainingSize;
  }

  showPartition() {
    // Select hight priority partition scheme
    this.installation.selectPartitionScheme = this.installation.partitionSchemesList[
      this.installation.partitionSchemesList.length - 1
    ];

    // Get Partition list of largest partition scheme
    return this.osInstallService
      .getOvhPartitionSchemesTemplatesDetail(
        this.informations.gabaritName,
        this.installation.selectPartitionScheme.name,
      )
      .then((partitionSchemeModels) => {
        this.installation.partitionSchemeModels = partitionSchemeModels.results;

        // get total use size (remainingSize),
        // assign random color
        // rename order by orderTable
        forEach(this.installation.partitionSchemeModels, (partition) => {
          set(partition, 'orderTable', angular.copy(partition.order));
        });

        // if one partition has size = 0 => replace by remaining size
        let hasEmptyPartitionSize = false;

        forEachRight(
          partitionSchemeModels.results,
          (partitionSchemeModel, partitionIndex) => {
            if (!hasEmptyPartitionSize) {
              set(
                this.installation.partitionSchemeModels[partitionIndex],
                'hasWarning',
                false,
              );

              if (
                get(
                  this.installation.partitionSchemeModels[partitionIndex],
                  'partitionSize',
                ) === 0
              ) {
                set(
                  this.installation.partitionSchemeModels[partitionIndex],
                  'partitionSize',
                  this.getRealRemainingSize(
                    this.installation.partitionSchemeModels[partitionIndex]
                      .raid,
                  ),
                );

                // To save information if user change nb disque
                // installation and personnalisation is not dirty
                set(
                  partitionSchemeModels[partitionIndex],
                  'isRemainingSizePartition',
                  true,
                );
                this.installation.dirtyPartition = false;
                hasEmptyPartitionSize = true;
              }
            }
          },
        );

        // for refresh progress bar
        this.getRemainingSize();
      })
      .catch((error) => {
        set(error, 'type', 'ERROR');
        this.handleError(
          error,
          this.$translate.instant(
            'server_configuration_installation_ovh_fail_partition_schemes',
            { t0: this.serviceName },
          ),
        );
      })
      .finally(() => {
        this.loader.loadingPartition = false;
      });
  }

  // ------STEP2------
  loadPartiton() {
    if (!this.installation.partitionSchemeModels) {
      this.loader.loadingPartition = true;

      // init
      this.newPartition.display = false;
      this.setPartition.save = null;
      this.setPartition.indexSet = -1;
      this.setPartition.delModel = null;
      this.clearError();

      return this.osInstallService
        .getOvhPartitionSchemesTemplates(
          this.serviceName,
          this.installation.selectDistribution.id,
          this.installation.selectLanguage,
          this.informations.customInstall,
        )
        .then((partitionSchemesList) => {
          this.installation.partitionSchemesList = partitionSchemesList.results;

          this.informations.gabaritName = partitionSchemesList.gabaritName;
          this.constants.raidList = partitionSchemesList.partitionRaidEnumMap;
          this.constants.fileSystemList =
            partitionSchemesList.templateOsFileSystemEnum;
          this.constants.partitionTypeList =
            partitionSchemesList.templatePartitionTypeEnum;

          // if hardware Raid
          if (this.installation.hardwareRaid.raid) {
            const newPartitioningScheme = {
              name: `hardwareRaid-${this.installation.hardwareRaid.raid}`,
              priority: 50,
            };
            return this.osInstallService
              .createPartitioningScheme(
                this.serviceName,
                this.informations.gabaritName,
                newPartitioningScheme,
              )
              .then(() =>
                this.osInstallService.cloneDefaultPartitioningScheme(
                  this.serviceName,
                  this.informations.gabaritName,
                  `hardwareRaid-${this.installation.hardwareRaid.raid}`,
                ),
              )
              .then(() => {
                this.installation.partitionSchemesList.push(
                  newPartitioningScheme,
                );
                this.installation.partitionSchemesList = sortBy(
                  this.installation.partitionSchemesList,
                  'priority',
                );
                return this.showPartition();
              })
              .catch((error) =>
                this.handleError(
                  error,
                  this.$translate.instant(
                    'server_configuration_installation_ovh_fail_partition_schemes',
                    { t0: this.serviceName },
                  ),
                ),
              )
              .finally(() => {
                this.loader.loadingPartition = false;
              });
          }
          this.installation.partitionSchemesList = sortBy(
            this.installation.partitionSchemesList,
            'priority',
          );
          if (this.installation.partitionSchemesList.length > 0) {
            return this.showPartition();
          }
          return null;
        })
        .catch((error) =>
          this.handleError(
            error,
            this.$translate.instant(
              'server_configuration_installation_ovh_fail_partition_schemes',
              { t0: this.serviceName },
            ),
          ),
        )
        .finally(() => {
          this.loader.loadingPartition = false;
        });
    }
    return this.$q.when({});
  }

  refreshDiskGroupInfos(newDiskGroup) {
    this.informations.isCachecade = newDiskGroup.raidController === 'cache';
    this.informations.raidController = newDiskGroup.raidController !== null;
    this.informations.typeDisk = newDiskGroup.diskType;
    this.informations.nbPhysicalDisk = newDiskGroup.numberOfDisks;
    this.informations.diskSize = Math.round(
      Utils.toBytes(newDiskGroup.diskSize) / 1000 / 1000,
    );
    this.informations.nbDisk =
      newDiskGroup.raidController !== null ? 1 : newDiskGroup.numberOfDisks;
    this.installation.nbDiskUse = this.informations.nbDisk;

    if (this.installation.hardwareRaid.availableSpace) {
      this.informations.totalSize = this.installation.hardwareRaid.availableSpace;
    } else {
      this.informations.totalSize =
        newDiskGroup.raidController !== null
          ? this.informations.diskSize
          : this.informations.diskSize * get(newDiskGroup, 'numberOfDisks', 0);
    }

    const otherDisk = find(
      this.informations.diskGroups,
      (diskGroup) => diskGroup.diskGroupId !== newDiskGroup.diskGroupId,
    );
    this.informations.otherDisk = map(compact([otherDisk]), (disk) => ({
      typeDisk: disk.diskType,
      nbDisk: disk.numberOfDisks,
      sizeDisk: Math.round(Utils.toBytes(disk.diskSize) / 1000 / 1000),
    }));
  }

  validationNbDiskUse(nbDisk) {
    let indexVarPartition = null;
    const raidList = this.getRaidList(nbDisk);

    this.configError.raidDiskUse = false;

    if (nbDisk !== 1) {
      forEachRight(
        this.installation.partitionSchemeModels,
        (partitionSchemeModel, partitionSchemeModelIndex) => {
          if (
            !this.installation.dirtyPartition &&
            indexVarPartition === null &&
            partitionSchemeModel &&
            partitionSchemeModel.isRemainingSizePartition
          ) {
            indexVarPartition = partitionSchemeModelIndex;
          }

          if (
            this.informations.nbDisk > 2 &&
            !includes(raidList, partitionSchemeModel.raid)
          ) {
            this.configError.raidDiskUse = true;
            set(partitionSchemeModel, 'hasWarning', true);
          } else {
            set(partitionSchemeModel, 'hasWarning', false);
          }
        },
      );
    }

    if (!this.installation.hardwareRaid.raid) {
      this.informations.totalSize =
        this.informations.diskSize * this.installation.nbDiskUse;
    }

    if (!this.configError.raidDiskUse && indexVarPartition !== null) {
      this.installation.partitionSchemeModels[
        indexVarPartition
      ].partitionSize = 0;
      this.installation.partitionSchemeModels[
        indexVarPartition
      ].partitionSize = this.getRealRemainingSize(
        this.installation.partitionSchemeModels[indexVarPartition].raid,
      );
    }

    this.getRemainingSize();
  }

  validationTypePrimary(forNewPartition) {
    let nbPrimary = 0;
    let nbOther = 0;

    forEach(this.installation.partitionSchemeModels, (partition2) => {
      if (partition2.typePartition === this.constants.warningPrimary) {
        nbPrimary += 1;
      } else {
        nbOther += 1;
      }
    });
    if (forNewPartition) {
      return nbPrimary === 4;
    }
    return (nbPrimary === 4 && nbOther > 0) || nbPrimary > 4;
  }

  // ------VALIDATION TOOLS------
  // Create table of boolean with key = the propertie and value = true
  // because this propertie is already use
  updateNoAllowProperties(excludedPartition) {
    this.validation.orderList = [];
    this.validation.mountPointList = [];
    this.validation.volumeNameList = [];
    this.validation.hasSwap = false;
    this.validation.maxOrder = 0;
    forEach(this.installation.partitionSchemeModels, (partition) => {
      if (this.validation.maxOrder < partition.order) {
        this.validation.maxOrder = partition.order;
      }
      if (!excludedPartition || excludedPartition.order !== partition.order) {
        this.validation.orderList[partition.order] = true;
      }
      if (
        !excludedPartition ||
        excludedPartition.mountPoint !== partition.mountPoint
      ) {
        this.validation.mountPointList[
          partition.mountPoint.toLowerCase()
        ] = true;
      }
      if (
        partition.volumeName &&
        (!excludedPartition ||
          excludedPartition.volumeName !== partition.volumeName)
      ) {
        this.validation.volumeNameList[
          partition.volumeName.toLowerCase()
        ] = true;
      }
      if (
        partition.fileSystem === this.constants.warningSwap &&
        (!excludedPartition ||
          excludedPartition.fileSystem !== this.constants.warningSwap)
      ) {
        this.validation.hasSwap = true;
      }
    });
  }

  // ------END VALIDATION TOOLS------

  // ------Add partition------

  displayNewPartition() {
    const raidList = this.getRaidList(this.installation.nbDiskUse);
    this.clearError();
    this.newPartition.raid =
      (raidList.length > 0 && raidList[raidList.length - 1]) ||
      this.constants.warningRaid1;
    this.newPartition.partitionSize = this.getRealRemainingSize(
      this.newPartition.raid,
    );

    if (
      includes(this.constants.partitionTypeList, this.constants.warningLogical)
    ) {
      this.newPartition.typePartition = angular.copy(
        this.constants.warningLogical,
      );
    } else {
      this.newPartition.typePartition = angular.copy(
        this.constants.partitionTypeList[0],
      );
    }
    if (
      this.installation.selectDistribution.family ===
      this.constants.warningWindows
    ) {
      if (includes(this.constants.fileSystemList, this.constants.warningNTFS)) {
        this.newPartition.fileSystem = angular.copy(this.constants.warningNTFS);
      } else {
        this.newPartition.fileSystem = angular.copy(
          this.constants.fileSystemList[0],
        );
      }
    } else if (
      includes(this.constants.fileSystemList, this.constants.warningEXT4)
    ) {
      this.newPartition.fileSystem = angular.copy(this.constants.warningEXT4);
    } else {
      this.newPartition.fileSystem = angular.copy(
        this.constants.fileSystemList[0],
      );
    }

    if (this.validationTypePrimary(true)) {
      this.errorInst.typePrimary = true;
    } else if (
      this.installation.selectDistribution.family ===
        this.constants.warningWindows &&
      this.newPartition.partitionSize < this.constants.minSizeWindows
    ) {
      this.errorInst.partitionSizeWindows = true;
    } else if (
      this.newPartition.partitionSize < this.constants.minSizePartition
    ) {
      this.errorInst.partitionSizeToAdd = true;
    } else {
      this.newPartition.display = true;
    }
    this.updateNoAllowProperties();
    this.newPartition.order = this.validation.maxOrder + 1;
    this.getRemainingSize();
  }

  checkall(partition) {
    this.validationMountPoint(partition);

    // this.validationOrder // load by validationMountPoint
    // this.validationType //load by validationOrder
    // this.validationRaid(partition); //load by /this.validationType
    this.validationVolumeName(partition);
    this.validationFileSystem(partition);

    // this.validationSize //load by validationRaid
  }

  isValidPartition() {
    return (
      !this.hasErrorOrder() &&
      !this.hasErrorType() &&
      !this.hasErrorFileSystem() &&
      !this.hasErrorMountPoint() &&
      !this.hasErrorVolumeName() &&
      !this.hasErrorRaid() &&
      !this.hasErrorSize()
    );
  }

  validAddPartition(bypassRaid) {
    let trueSize = 0;
    this.buttonControl.addInProgress = true;
    this.checkall(this.newPartition);
    if (this.isValidPartition()) {
      if (!bypassRaid && this.warning.raid0) {
        this.buttonControl.displayAddConfirmation = true;
        this.buttonControl.addInProgress = false;
      } else {
        trueSize = this.newPartition.partitionSize;
        if (this.newPartition.typePartition !== this.constants.warningLV) {
          this.newPartition.volumeName = null;
        }

        if (
          this.informations.raidController ||
          this.informations.nbDisk === 1
        ) {
          this.newPartition.raid = null;
        }

        this.osInstallService
          .postAddPartition(
            this.informations.gabaritName,
            this.installation.selectPartitionScheme.name,
            {
              raid: this.newPartition.raid,
              fileSystem: this.newPartition.fileSystem,
              typePartition: this.newPartition.typePartition,
              volumeName: this.newPartition.volumeName,
              order: this.newPartition.order,
              mountPoint: this.newPartition.mountPoint,
              oldMountPoint: this.newPartition.mountPoint,
              partitionSize: trueSize,
            },
          )
          .then(() => {
            this.warning.raid0 = false;
            this.newPartition.partitionSize = trueSize;
            this.newPartition.orderTable = angular.copy(
              this.newPartition.order,
            );
            this.installation.partitionSchemeModels.push(
              angular.copy(this.newPartition),
            );

            this.newPartition.order = null;
            this.newPartition.typePartition = null;
            this.newPartition.fileSystem = null;
            this.newPartition.mountPoint = null;
            this.newPartition.volumeName = null;
            this.newPartition.raid = null;
            this.newPartition.partitionSize = null;

            this.newPartition.display = false;

            this.buttonControl.displayAddConfirmation = false;
            this.buttonControl.addInProgress = false;
            this.clearError();
            // this.refreshBar();
            this.validationNbDiskUse(this.installation.nbDiskUse);
          })
          .catch((error) => {
            this.buttonControl.addInProgress = false;
            this.errorInst.ws = this.$translate.instant(
              'server_configuration_installation_ovh_step2_error_add',
              {
                t0: this.newPartition.mountPoint,
                t1: error.data.message || error.message,
              },
            );
          });
      }
    } else {
      this.buttonControl.addInProgress = false;
    }
    this.getRemainingSize();
  }

  cancelAddPartition() {
    this.newPartition.display = false;
    this.getRemainingSize();
    this.clearError();
  }

  // ------Set partition------

  // Get index in partitionSchemeModels table where partition is located
  getIndexOfPartition(partition) {
    return findLastIndex(
      this.installation.partitionSchemeModels,
      (partitionSchemeModel) =>
        get(partitionSchemeModel, 'order') === partition.order,
    );
  }

  displaySetPartition(partition) {
    // Use index for save what partition is changed
    const index = this.getIndexOfPartition(partition);
    this.clearError();
    this.setPartition.indexSet = index;
    this.setPartition.save = angular.copy(
      this.installation.partitionSchemeModels[index],
    );
    this.updateNoAllowProperties(partition);
    this.getRemainingSize();
  }

  validSetPartition(bypassRaid) {
    const partitionToSet = this.installation.partitionSchemeModels[
      this.setPartition.indexSet
    ];
    let trueSize = 0;
    this.buttonControl.setInProgress = true;
    this.checkall(partitionToSet);
    if (this.isValidPartition()) {
      if (!bypassRaid && this.warning.raid0) {
        this.buttonControl.displayAddConfirmation = true;
        this.buttonControl.setInProgress = false;
      } else {
        trueSize = partitionToSet.partitionSize;
        if (partitionToSet.typePartition !== this.constants.warningLV) {
          partitionToSet.volumeName = null;
        }

        this.osInstallService
          .putSetPartition(
            this.informations.gabaritName,
            this.installation.selectPartitionScheme.name,
            {
              raid: partitionToSet.raid,
              fileSystem: partitionToSet.fileSystem,
              typePartition: partitionToSet.typePartition,
              volumeName: partitionToSet.volumeName,
              order: partitionToSet.order,
              mountPoint: partitionToSet.mountPoint,
              oldMountPoint: this.setPartition.save.mountPoint,
              partitionSize: trueSize,
            },
          )
          .then(() => {
            if (partitionToSet.isRemainingSizePartition) {
              this.installation.dirtyPartition = true;
            }
            this.warning.raid0 = false;

            partitionToSet.partitionSize = trueSize;
            partitionToSet.orderTable = angular.copy(partitionToSet.order);

            this.setPartition.save = null;
            this.setPartition.indexSet = -1;

            this.buttonControl.displayAddConfirmation = false;
            this.buttonControl.setInProgress = false;
            this.clearError();
            this.validationNbDiskUse(this.installation.nbDiskUse);
          })
          .catch((error) => {
            this.buttonControl.setInProgress = false;
            this.errorInst.ws = this.$translate.instant(
              'server_configuration_installation_ovh_step2_error_set',
              {
                t0: partitionToSet.mountPoint,
                t1: error.data.message || error.message,
              },
            );
          });
      }
    } else {
      this.buttonControl.setInProgress = false;
    }
    this.getRemainingSize();
  }

  cancelSetPartition() {
    this.installation.partitionSchemeModels[
      this.setPartition.indexSet
    ] = angular.copy(this.setPartition.save);
    this.setPartition.save = null;
    this.setPartition.indexSet = -1;
    this.getRemainingSize();
    this.clearError();
  }

  // ------Delete partition------

  deletePartition(partition) {
    this.setPartition.delModel = this.getIndexOfPartition(partition);
    this.getRemainingSize();
  }

  deleteValidPartition() {
    this.buttonControl.deleteInProgress = true;
    this.osInstallService
      .deleteSetPartition(
        this.informations.gabaritName,
        this.installation.selectPartitionScheme.name,
        this.installation.partitionSchemeModels[this.setPartition.delModel]
          .mountPoint,
      )
      .then(() => {
        if (
          this.installation.partitionSchemeModels[this.setPartition.delModel]
            .isRemainingSizePartition
        ) {
          this.installation.dirtyPartition = true;
        }
        this.installation.partitionSchemeModels.splice(
          this.setPartition.delModel,
          1,
        );
        this.setPartition.delModel = null;
        this.getRemainingSize();
        this.buttonControl.deleteInProgress = false;
        this.clearError();
        this.validationNbDiskUse(this.installation.nbDiskUse);
      })
      .catch((error) => {
        this.buttonControl.deleteInProgress = false;
        this.errorInst.ws = this.$translate.instant(
          'server_configuration_installation_ovh_step2_error_delete',
          {
            t0: this.setPartition.delModel.mountPoint,
            t1: error.data.message || error.message,
          },
        );
      });
  }

  deleteCancelPartition() {
    this.setPartition.delModel = null;
    this.getRemainingSize();
  }

  // ------Common partition------

  cancelRaid0Partition() {
    this.buttonControl.displayAddConfirmation = false;
    this.getRemainingSize();
  }

  validPartition() {
    if (this.newPartition.display && !this.buttonControl.addInProgress) {
      this.validAddPartition(true);
    } else if (!this.buttonControl.setInProgress && this.setPartition.save) {
      this.validSetPartition(true);
    }
  }

  hasErrorOrder() {
    return (
      this.errorInst.order ||
      this.errorInst.orderFirst ||
      this.errorInst.orderType ||
      this.errorInst.orderFirstWin
    );
  }

  validationOrder(partition) {
    let firstPartition = partition;
    let hasBoot = false;

    if (!partition.order) {
      if (this.newPartition.display) {
        set(
          partition,
          'order',
          this.installation.partitionSchemeModels.length + 1,
        );
      } else {
        set(partition, 'order', angular.copy(this.setPartition.save.order));
      }
    }
    this.errorInst.order = this.validation.orderList[partition.order];

    if (!this.errorInst.order) {
      forEach(this.installation.partitionSchemeModels, (partition2) => {
        if (partition2.order < firstPartition.order) {
          firstPartition = partition2;
        }
        if (partition2.mountPoint === this.constants.warningBoot) {
          hasBoot = true;
        }
      });
      if (this.newPartition.display) {
        if (partition.mountPoint === this.constants.warningBoot) {
          hasBoot = true;
        }
      }
      if (
        this.installation.selectDistribution.family !==
        this.constants.warningWindows
      ) {
        this.errorInst.orderFirst =
          (hasBoot &&
            firstPartition.mountPoint !== this.constants.warningBoot) ||
          (!hasBoot &&
            firstPartition.mountPoint !== this.constants.warningRoot &&
            firstPartition.mountPoint !== this.constants.warningBoot);
      } else {
        this.errorInst.orderFirstWin =
          firstPartition.mountPoint !== this.constants.warningCwin;
      }
    }
    this.validationType(partition);
  }

  // ------TYPE VALIDATION------
  validationVolumeNameByType(partition) {
    this.errorInst.volumeNameEmpty =
      !this.errorInst.typeLvSwap &&
      !this.errorInst.typeLogicalLv &&
      partition.typePartition === this.constants.warningLV &&
      (!partition.volumeName || partition.volumeName === '');
  }

  hasErrorType() {
    return (
      this.errorInst.orderType ||
      this.errorInst.typePrimary ||
      this.errorInst.typeLvSwap ||
      this.errorInst.typeLogicalLv ||
      this.errorInst.mountPointPrimary
    );
  }

  validationType(partition) {
    let nbLv = 0;
    let nbLogical = 0;

    this.errorInst.typeLvSwap =
      partition.typePartition === this.constants.warningLV &&
      partition.fileSystem === this.constants.warningSwap;

    if (
      this.installation.selectDistribution.family ===
        this.constants.warningWindows &&
      partition.mountPoint === this.constants.warningCwin
    ) {
      this.errorInst.mountPointPrimary =
        partition.typePartition !== this.constants.warningPrimary;
    } else {
      this.errorInst.mountPointPrimary = false;
    }

    this.errorInst.orderType = false;

    // this.errorInst.orderLv = false;
    this.errorInst.typeLogicalLv = false;
    if (
      !this.errorInst.order &&
      !this.errorInst.orderFirst &&
      !this.errorInst.typeLvSwap &&
      !this.errorInst.mountPointPrimary
    ) {
      forEach(this.installation.partitionSchemeModels, (partition2) => {
        // Primary first Test
        if (
          (partition2.order < partition.order &&
            partition2.typePartition !== this.constants.warningPrimary &&
            partition.typePartition === this.constants.warningPrimary) ||
          (partition2.order > partition.order &&
            partition2.typePartition === this.constants.warningPrimary &&
            partition.typePartition !== this.constants.warningPrimary)
        ) {
          this.errorInst.orderType = true;
        }
        if (partition2.typePartition === this.constants.warningLV) {
          nbLv += 1;
        } else if (partition2.typePartition === this.constants.warningLogical) {
          nbLogical += 1;
        }
      });
      if (this.newPartition.display) {
        if (partition.typePartition === this.constants.warningLV) {
          nbLv += 1;
        } else if (partition.typePartition === this.constants.warningLogical) {
          nbLogical += 1;
        }
      }
      if (nbLv !== 0 && nbLogical !== 0) {
        this.errorInst.typeLogicalLv = true;
      }
    }

    this.errorInst.typePrimary =
      !this.errorInst.orderType && this.validationTypePrimary();
    this.validationRaid(partition);
    this.validationVolumeNameByType(partition);
  }

  // ------FILE SYSTEM VALIDATION------

  hasErrorFileSystem() {
    return this.errorInst.fileSystemSwap || this.errorInst.fileSystemNoSwap;
  }

  validationFileSystem(partition) {
    this.errorInst.fileSystemSwap =
      this.validation.hasSwap &&
      partition.fileSystem === this.constants.warningSwap;
    this.errorInst.fileSystemNoSwap =
      this.installation.selectDistribution.family !==
        this.constants.warningWindows &&
      !this.validation.hasSwap &&
      partition.fileSystem !== this.constants.warningSwap;
    if (!this.errorInst.fileSystemSwap) {
      if (partition.fileSystem === this.constants.warningSwap) {
        set(partition, 'mountPoint', this.constants.swapLabel);
        this.validationMountPoint(partition);
      }
      this.validationSize(partition);
    }
  }

  // ------MOUNT POINT VALIDATION------

  hasErrorMountPoint() {
    return (
      this.errorInst.mountPointUse ||
      this.errorInst.mountPointEmpty ||
      this.errorInst.mountPoint ||
      this.errorInst.mountPoint2 ||
      this.errorInst.mountPointWindows ||
      this.errorInst.orderFirst ||
      this.errorInst.orderFirstWin
    );
  }

  validationMountPoint(partition) {
    this.errorInst.mountPointEmpty = !partition.mountPoint;
    this.errorInst.mountPointUse =
      !this.errorInst.mountPointEmpty &&
      this.validation.mountPointList[partition.mountPoint.toLowerCase()];

    if (partition.fileSystem !== this.constants.warningSwap) {
      if (
        this.installation.selectDistribution.family !==
        this.constants.warningWindows
      ) {
        this.errorInst.mountPoint =
          !this.errorInst.mountPointEmpty &&
          !this.errorInst.mountPointUse &&
          (!!~this.constants.forbiddenMountPoint.indexOf(
            partition.mountPoint.toLowerCase(),
          ) ||
          /\/\.{1,2}(\/|$)/.test(partition.mountPoint) || // /../
          /\/-/.test(partition.mountPoint) || // /-
          /\/\//.test(partition.mountPoint) || // //
            !/^\/[A-Za-z0-9._\-/]{0,254}$/.test(partition.mountPoint));

        this.errorInst.mountPoint2 =
          !this.errorInst.mountPointEmpty &&
          !this.errorInst.mountPointUse &&
          !this.errorInst.mountPoint &&
          /^\/var\/log/.test(partition.mountPoint.toLowerCase()) &&
          /^(ovh|gentoo-ovh_64|gentoo-ovh)$/.test(
            this.installation.selectDistribution.family,
          );
      } else if (
        this.installation.selectDistribution.family ===
        this.constants.warningWindows
      ) {
        this.errorInst.mountPointWindows =
          !this.errorInst.mountPointEmpty &&
          !this.errorInst.mountPointUse &&
          !/^[c-z]:$/.test(partition.mountPoint.toLowerCase());
      }
    } else {
      this.errorInst.mountPoint = false;
      this.errorInst.mountPoint2 = false;
      this.errorInst.mountPointWindows = false;
    }
    this.validationOrder(partition);
  }

  // ------VOLUME NAME VALIDATION------

  hasErrorVolumeName() {
    return (
      this.errorInst.volumeNameEmpty ||
      this.errorInst.volumeName ||
      this.errorInst.volumeNameUse
    );
  }

  validationVolumeName(partition) {
    this.validationVolumeNameByType(partition);
    this.errorInst.volumeName =
      !this.errorInst.typeLvSwap &&
      !this.errorInst.typeLogicalLv &&
      !this.errorInst.volumeNameEmpty &&
      partition.typePartition === this.constants.warningLV &&
      (!/^[a-zA-Z0-9]{1,16}$/.test(partition.volumeName) ||
        partition.volumeName.toLowerCase() === 'snapshot' ||
        partition.volumeName.toLowerCase() === 'pvmove');
    this.errorInst.volumeNameUse =
      !this.errorInst.typeLvSwap &&
      !this.errorInst.typeLogicalLv &&
      !this.errorInst.volumeNameEmpty &&
      !this.errorInst.volumeName &&
      partition.typePartition === this.constants.warningLV &&
      this.validation.volumeNameList[partition.volumeName.toLowerCase()];
  }

  // ------Soft RAID VALIDATION------

  hasErrorRaid() {
    return this.errorInst.raid0 || this.errorInst.raidLv;
  }

  validationRaid(partition) {
    this.errorInst.raidLv = false;
    if (this.installation.nbDiskUse > 1 && !this.informations.raidController) {
      this.errorInst.raid0 =
        partition.raid !== this.constants.warningRaid1 &&
        partition.raid !== this.constants.warningRaid0 &&
        (partition.mountPoint === this.constants.warningBoot ||
          partition.mountPoint === this.constants.warningRoot);
      this.warning.raid0 =
        !this.errorInst.raid0 &&
        partition.raid === this.constants.warningRaid0 &&
        partition.fileSystem !== this.constants.warningSwap;
    }
    if (
      this.installation.nbDiskUse > 1 &&
      !this.informations.raidController &&
      partition.typePartition === this.constants.warningLV
    ) {
      forEach(this.installation.partitionSchemeModels, (partition2) => {
        if (
          partition2.typePartition === this.constants.warningLV &&
          partition2.raid !== partition.raid
        ) {
          this.errorInst.raidLv = true;
        }
      });
    }

    this.validationSize(partition);
  }

  // ------SIZE VALIDATION------

  hasErrorSize() {
    return (
      this.errorInst.partitionSizeOver ||
      this.errorInst.partitionSizeSwap ||
      this.errorInst.partitionSize ||
      this.errorInst.partitionSizeBoot ||
      this.errorInst.partitionSizeReiserfs ||
      this.errorInst.partitionSizeWindows ||
      this.errorInst.partitionSizeMin ||
      this.errorInst.partitionSizeRequired
    );
  }

  // swap size > 30Go = error
  validationSizeSwap(partition) {
    this.errorInst.partitionSizeSwap =
      partition.fileSystem === this.constants.warningSwap &&
      this.getRealDisplaySize({
        partition,
        notDisplay: true,
        noRaid: true,
      }) > this.constants.maxSizeSwap;
    return this.errorInst.partitionSizeSwap;
  }

  // partition size > 2To = error
  validationSizeMax(partition) {
    this.errorInst.partitionSize =
      partition.fileSystem !== this.constants.warningZFS &&
      !this.installation.selectDistribution.supportsGpt &&
      this.getRealDisplaySize({
        partition,
        notDisplay: true,
        noRaid: true,
      }) > this.constants.maxSizePartition;
    return this.errorInst.partitionSize;
  }

  // boot size < 50Mo = error
  validationSizeBoot(partition) {
    this.errorInst.partitionSizeBoot =
      partition.mountPoint === this.constants.warningBoot &&
      this.getRealDisplaySize({
        partition,
        notDisplay: true,
        noRaid: true,
      }) < this.constants.minSizeBoot;
    return this.errorInst.partitionSizeBoot;
  }

  // reiserfs size < 32Mo = error
  validationSizeReiserfs(partition) {
    this.errorInst.partitionSizeReiserfs =
      partition.fileSystem === this.constants.warningReiserfs &&
      this.getRealDisplaySize({
        partition,
        notDisplay: true,
        noRaid: true,
      }) < this.constants.minSizeReiserfs;
    return this.errorInst.partitionSizeReiserfs;
  }

  // windows size < 20Go = error
  validationSizeWindowsMin(partition) {
    this.errorInst.partitionSizeWindows =
      this.installation.selectDistribution.family ===
        this.constants.warningWindows &&
      this.getRealDisplaySize({
        partition,
        notDisplay: true,
        noRaid: true,
      }) < this.constants.minSizeWindows;
    return this.errorInst.partitionSizeWindows;
  }

  // partition size < 10Mo = error
  validationSizeMin(partition) {
    this.errorInst.partitionSizeMin =
      this.getRealDisplaySize({
        partition,
        notDisplay: true,
        noRaid: true,
      }) < this.constants.minSizePartition;
    return this.errorInst.partitionSizeMin;
  }

  validationSize(partition) {
    if (partition.partitionSize) {
      set(
        partition,
        'partitionSize',
        parseInt(partition.partitionSize.toString().replace('.', ''), 10),
      );
    }
    this.errorInst.partitionSizeRequired = !/^[0-9]{1,20}$/.test(
      partition.partitionSize,
    );

    this.getRemainingSize();
    return (
      this.errorInst.partitionSizeOver ||
      this.validationSizeSwap(partition) ||
      this.validationSizeMax(partition) ||
      this.validationSizeBoot(partition) ||
      this.validationSizeReiserfs(partition) ||
      this.validationSizeWindowsMin(partition) ||
      this.validationSizeMin(partition)
    );
  }

  // ------END VALIDATION------

  // ------TOOLS------

  // return range between 1 and nbdisque of server if > 1
  static getNbDisqueList(nbdisk) {
    if (nbdisk > 1) {
      return range(1, nbdisk + 1);
    }
    return [nbdisk];
  }

  // return list of available raid
  getRaidList(nbDisk) {
    if (nbDisk !== null && this.constants.raidList !== null) {
      if (nbDisk >= 4) {
        if (nbDisk % 2 === 0) {
          return this.constants.raidList[4] || [];
        }
        return this.constants.raidList[3] || [];
      }
      return this.constants.raidList[nbDisk] || [];
    }
    return [];
  }

  // Reture true if partition is in edit mode
  isSetPartition(partition) {
    return (
      this.installation.partitionSchemeModels[this.setPartition.indexSet] ===
      partition
    );
  }

  getDisplaySize(octetsSize, unitIndex = 0) {
    return this.$filter('formatSize')(octetsSize, unitIndex);
  }

  getFullSize(partition) {
    set(partition, 'partitionSize', 0); // important
    set(partition, 'partitionSize', this.getRealRemainingSize(partition.raid));
    this.validationSize(partition);
  }

  // Display real space depending on the raid. if setting or adding,
  // {partition, notDisplay, noRaid}
  getRealDisplaySize(option) {
    if (option.partition && option.partition.takeRemainingSpace) {
      return this.getDisplaySize(this.getRemainingSize());
    }
    if (option.partition && !Number.isNaN(option.partition.partitionSize)) {
      if (
        option.noRaid ||
        this.installation.nbDiskUse === 1 ||
        this.informations.raidController
      ) {
        set(option, 'partition.realSize', option.partition.partitionSize);
      } else if (option.partition.raid) {
        switch (option.partition.raid) {
          case '_0':
            set(option, 'partition.realSize', option.partition.partitionSize);
            break;
          case '_1':
            set(
              option,
              'partition.realSize',
              option.partition.partitionSize * this.installation.nbDiskUse,
            );
            break;
          case '_5':
            set(
              option,
              'partition.realSize',
              option.partition.partitionSize +
                option.partition.partitionSize /
                  (this.installation.nbDiskUse - 1),
            );
            break;
          case '_6':
            set(
              option,
              'partition.realSize',
              option.partition.partitionSize * 2,
            );
            break;
          case '_10':
            set(
              option,
              'partition.realSize',
              option.partition.partitionSize *
                (this.installation.nbDiskUse / 2),
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
    let remainingSize = this.informations.totalSize;

    // all partition
    forEach(this.installation.partitionSchemeModels, (partition) => {
      if (partition.partitionSize) {
        remainingSize -= this.getRealDisplaySize({
          partition,
          notDisplay: true,
        });
      }
    });

    // new partition
    if (
      this.newPartition.display &&
      !Number.isNaN(this.newPartition.partitionSize)
    ) {
      remainingSize -= this.getRealDisplaySize({
        partition: this.newPartition,
        notDisplay: true,
      });
    }

    // delete partition
    if (
      this.setPartition.delModel &&
      this.installation.partitionSchemeModels[this.setPartition.delModel] &&
      !Number.isNaN(
        this.installation.partitionSchemeModels[this.setPartition.delModel]
          .partitionSize,
      )
    ) {
      remainingSize += this.getRealDisplaySize({
        partition: this.installation.partitionSchemeModels[
          this.setPartition.delModel
        ],
        notDisplay: true,
      });
    }

    this.informations.remainingSize = remainingSize;
    this.errorInst.partitionSizeOver = false;

    if (remainingSize < 0) {
      this.errorInst.partitionSizeOver = true;
      this.informations.remainingSize = 0;
    }
    // this.refreshBar();

    return this.informations.remainingSize;
  }

  prepareDiskList() {
    const disksPerArray =
      this.installation.hardwareRaid.disks /
      this.installation.hardwareRaid.arrays;
    if (this.installation.hardwareRaid.arrays === 1) {
      return take(
        this.installation.hardwareRaid.controller.disks[0].names,
        this.installation.hardwareRaid.disks,
      );
    }

    // API expect something like this...:
    // "disks": [
    //    "[c0:d0, c0:d1, c0:d2]",
    //    "[c0:d3, c0:d4, c0:d5]",
    //    "[c0:d6, c0:d7, c0:d8]",
    //    "[c0:d9, c0:d10, c0:d11]"
    // ]
    return map(
      chunk(
        take(
          this.installation.hardwareRaid.controller.disks[0].names,
          this.installation.hardwareRaid.disks,
        ),
        disksPerArray,
      ),
      (elem) => `[${elem.toString()}]`,
    );
  }

  addRemainingSize() {
    const remainingSize = this.getRemainingSize();

    if (
      (this.constants.minSizePartition > remainingSize &&
        this.installation.selectDistribution.family !==
          this.constants.warningWindows) ||
      (this.constants.minSizeWindows > remainingSize &&
        this.installation.selectDistribution.family ===
          this.constants.warningWindows)
    ) {
      forEach(this.installation.partitionSchemeModels, (partition) => {
        if (
          !this.installation.options.variablePartition ||
          (this.installation.options.variablePartition.partitionSize <
            partition.partitionSize &&
            this.installation.options.variablePartition.partitionSize !== 0)
        ) {
          this.installation.options.variablePartition = partition;
          this.installation.variablePartition = true;
        }
      });
    }
  }

  // used on read-only mode of partition
  // checkIntegrity() {
  //   this.errorInst.ws = null;
  //   this.installation.variablePartition = false;
  //   this.installation.options = {
  //     saveGabarit: false,
  //     gabaritNameSave: null,
  //     changeLog: null,
  //     customHostname: null,
  //     postInstallationScriptLink: null,
  //     postInstallationScriptReturn: null,
  //     sshKeyName: null,
  //     useDistributionKernel: false,
  //     installSqlServer: false,
  //     useSpla: false,
  //     variablePartition: null,
  //     validForm: true,
  //   };

  //   if (
  //     this.installation.customInstall &&
  //     this.informations.gabaritName
  //   ) {
  //     this.loader.loading = true;
  //     this.osInstallService.checkIntegrity(this.informations.gabaritName).then(
  //       () => {
  //         this.loader.loading = false;
  //       },
  //       (data) => {
  //         this.loader.loading = false;
  //         this.errorInst.ws = $translate.instant(
  //           'server_configuration_installation_ovh_step3_error_integrity',
  //           { t0: data },
  //         );
  //       },
  //     );
  //     this.addRemainingSize();
  //   } else {
  //     this.loadPartiton();
  //   }
  // };

  // ------INSTALL------
  validationGabaritName() {
    this.errorInst.gabaritName = !/^[a-zA-Z0-9_-]{1,50}$/.test(
      this.installation.gabaritNameSave,
    );
  }

  getMountPoint() {
    const list = [];
    forEach(this.installation.partitionSchemeModels, (partition) => {
      if (partition.fileSystem !== this.constants.warningSwap) {
        list.push(partition);
      }
    });
    return list;
  }

  saveRemainingSize(_size, stop) {
    let size = _size;

    if (!stop) {
      this.errorInst.wsinstall = null;
    }
    if (this.installation.customInstall) {
      // if install fail before start
      if (!size) {
        size = 0;
        if (this.installation.options.variablePartition) {
          this.installation.saveSize = this.installation.options.variablePartition.partitionSize;
        }
      }

      // if user has check, change variable partition and uncheck save gabarit
      if (!this.installation.options.saveGabarit) {
        this.addRemainingSize();
      }

      if (this.installation.options.variablePartition) {
        this.loader.isInstalling = true;
        this.osInstallService
          .putSetPartition(
            this.informations.gabaritName,
            this.installation.selectPartitionScheme.name,
            {
              raid: this.installation.options.variablePartition.raid,
              fileSystem: this.installation.options.variablePartition
                .fileSystem,
              typePartition: this.installation.options.variablePartition
                .typePartition,
              volumeName: this.installation.options.variablePartition
                .volumeName,
              order: this.installation.options.variablePartition.order,
              mountPoint: this.installation.options.variablePartition
                .mountPoint,
              oldMountPoint: this.installation.options.variablePartition
                .mountPoint,
              partitionSize: size,
            },
          )
          .then(() => {
            if (!stop) {
              this.install();
            } else {
              this.loader.isInstalling = false;
            }
          })
          .catch((error) => {
            if (size === 0) {
              this.errorInst.wsinstall = this.$translate.instant(
                'server_configuration_installation_ovh_step3_remaining_error',
                {
                  t0: this.installation.options.variablePartition.mountPoint,
                  t1: error.message || error.data?.message,
                },
              );
              this.handleError(error, this.errorInst.wsinstall);
            } // else it's revert size
          })
          .finally(() => {
            this.loader.isInstalling = false;
          });
      } else if (!stop) {
        this.install();
      }
    } else if (!stop) {
      this.install();
    }
  }

  isDefaultDiskGroup(diskGroup) {
    return (
      diskGroup &&
      this.informations.diskGroups[0].diskGroupId === diskGroup.diskGroupId
    );
  }

  startInstall() {
    this.trackClick(
      `dedicated::dedicated::server::system-install::public-catalog::rtm::${
        this.installation.options.installRTM ? 'activate' : 'deactivate'
      }`,
    );
    this.loader.isInstalling = true;
    this.osInstallService
      .startInstallation(this.serviceName, this.informations.gabaritName, {
        language: camelCase(this.installation.selectLanguage),
        installRTM: this.installation.options.installRTM || false,
        customHostname: this.installation.options.customHostname,
        installSqlServer: this.installation.options.installSqlServer,
        postInstallationScriptLink: this.installation.options
          .postInstallationScriptLink,
        postInstallationScriptReturn: this.installation.options
          .postInstallationScriptLink
          ? this.installation.options.postInstallationScriptReturn
          : null,
        sshKeyName: this.installation.options.sshKeyName,
        useDistribKernel: this.installation.options.useDistributionKernel,
        useSpla: this.installation.options.useSpla,
        softRaidDevices:
          this.informations.nbDisk > 2 && this.installation.nbDiskUse > 1
            ? this.installation.nbDiskUse
            : null,
        noRaid:
          this.installation.nbDiskUse === 1 &&
          !this.informations.raidController,
        diskGroupId: !this.isDefaultDiskGroup(this.installation.diskGroup)
          ? this.installation.diskGroup.diskGroupId
          : null,
        resetHwRaid: !this.isDefaultDiskGroup(this.installation.diskGroup),
      })
      .then((task) => {
        set(task, 'id', task.taskId);
        this.goBack(
          this.$translate.instant('server_os_install_ovh_success', {
            progressHref: this.installProgressHref,
          }),
        );
      })
      .catch((error) => {
        this.saveRemainingSize(this.installation.saveSize, true);
        this.errorInst.wsinstall = this.$translate.instant(
          'server_configuration_installation_ovh_step3_error',
          {
            t0: this.installation.selectDistribution.displayName,
            t1: this.serviceName,
            t2: this.installation.selectLanguage,
            t3: error.message || error.data?.message,
          },
        );
        this.handleError(error, this.errorInst.wsinstall);
      })
      .finally(() => {
        this.loader.isInstalling = false;
      });
  }

  setHardwareRaid() {
    const disks = this.prepareDiskList();

    this.osInstallService
      .postHardwareRaid(
        this.serviceName,
        this.informations.gabaritName,
        this.installation.selectPartitionScheme.name,
        disks,
        this.installation.hardwareRaid.raid,
      )
      .catch((error) => {
        if (error.status === 409) {
          return this.osInstallService.putHardwareRaid(
            this.serviceName,
            this.informations.gabaritName,
            this.installation.selectPartitionScheme.name,
            disks,
            this.installation.hardwareRaid.raid,
          );
        }
        return this.$q.reject(error);
      })
      .then(() => {
        this.startInstall();
      })
      .catch(() => {
        this.saveRemainingSize(this.installation.saveSize, true);
        this.errorInst.wsinstall = this.$translate.instant(
          'server_configuration_installation_error_hardwareRaid',
        );
      })
      .finally(() => {
        this.loader.loading = false;
      });
  }

  setGabarit() {
    this.osInstallService
      .putSetGabarit(
        this.serviceName,
        this.informations.gabaritName,
        this.installation.options.gabaritNameSave,
        {
          changeLog: this.installation.options.changeLog,
          customHostname: this.installation.options.customHostname,
          postInstallationScriptLink: this.installation.options
            .postInstallationScriptLink,
          postInstallationScriptReturn: this.installation.options
            .postInstallationScriptLink
            ? this.installation.options.postInstallationScriptReturn
            : null,
          sshKeyName: this.installation.options.sshKeyName,
          useDistributionKernel: this.installation.options
            .useDistributionKernel,
        },
      )
      .then(() => {
        this.informations.gabaritName = angular.copy(
          this.installation.options.gabaritNameSave,
        );
        if (this.installation.hardwareRaid.raid) {
          this.setHardwareRaid();
        } else {
          this.startInstall();
        }
      })
      .catch((error) => {
        this.saveRemainingSize(this.installation.saveSize, true);
        this.errorInst.wsinstall = this.$translate.instant(
          'server_configuration_installation_error_save',
          { t0: error.data.message },
        );
      })
      .finally(() => {
        this.loader.isInstalling = false;
      });
  }

  install() {
    this.trackClick(
      'dedicated::dedicated::server::system-install::public-catalog::install',
    );
    if (this.installation.options.saveGabarit) {
      this.loader.isInstalling = true;
      this.setGabarit();
    } else if (this.installation.hardwareRaid.raid) {
      this.installation.options.gabaritNameSave = `tmp-mgr-hardwareRaid-${Math.round(
        new Date().getTime() / 1000,
      )}`;
      this.setGabarit();
    } else {
      this.startInstall();
    }
  }

  canPersonnalizeRaid() {
    return (
      this.raidIsPersonnalizable() &&
      this.isDefaultDiskGroup(this.installation.diskGroup)
    );
  }

  raidIsPersonnalizable() {
    return (
      this.constants.server.raidController &&
      get(this.installation, 'selectDistribution.hardRaidConfiguration') !==
        false &&
      !this.informations.hardwareRaid.error.wrongLocation &&
      !this.informations.hardwareRaid.error.notAvailable
    );
  }

  canEditDiskGroup() {
    return (
      this.informations.diskGroups.length > 1 &&
      this.installation.isHybridCompatible
    );
  }

  hasVirtualDesktop() {
    return !includes(get(this.installation, 'selectDistribution.id'), 'hyperv');
  }

  hasLicencedOs() {
    return find(
      this.installation.distributionList,
      (distribution) => distribution.family === 'WINDOWS',
    );
  }

  static transformData(templates) {
    const categories = {};
    forEach(templates, (template) => {
      if (!categories[template.category]) {
        categories[template.category] = {};
      }
      const category = categories[template.category];
      if (!category[template.family]) {
        category[template.family] = {
          name: template.family,
          templates: [],
        };
      }
      category[template.family].templates.push(template);
    });
    return categories;
  }

  onPartitionFocus() {
    // this.$scope.$broadcast('osInstall.configureInstallation.partitionFocus', true);
    this.refreshDiskGroupInfos(this.installation.diskGroup);
    this.loadPartiton();
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
}
