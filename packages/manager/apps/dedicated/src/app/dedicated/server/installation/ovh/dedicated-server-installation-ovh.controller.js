import chunk from 'lodash/chunk';
import camelCase from 'lodash/camelCase';
import compact from 'lodash/compact';
import find from 'lodash/find';
import get from 'lodash/get';
import includes from 'lodash/includes';
import map from 'lodash/map';
import range from 'lodash/range';
import some from 'lodash/some';
import sortBy from 'lodash/sortBy';
import take from 'lodash/take';

angular
  .module('App')
  .constant('TEMPLATE_OS_HARDWARE_RAID_ENUM', {
    raid0: 'raid0',
    raid1: 'raid1',
    raid5: 'raid5',
    raid6: 'raid6',
    raid10: 'raid10',
    raid50: 'raid50',
    raid60: 'raid60',
  })
  .controller('ServerInstallationOvhCtrl', ($rootScope, $scope, $q, $stateParams, $translate, Server, $filter, Alerter, TEMPLATE_OS_HARDWARE_RAID_ENUM) => {
    $scope.units = {
      model: [
        {
          label: 'MB',
          value: 1,
        },
        {
          label: 'GB',
          value: 1000,
        },
        {
          label: 'TB',
          value: Math.pow(1000, 2), // eslint-disable-line no-restricted-properties
        },
      ],
    };

    $scope.countFilter = [];

    $scope.constants = {
      server: angular.copy($scope.currentActionData),

      // get by Server.getOvhPartitionSchemesTemplates
      raidList: null, // Map[nbDisk, available raid]
      fileSystemList: null,
      partitionTypeList: null,

      forbiddenMountPoint: ['/etc', '/bin', '/sbin', '/dev', '/lib', '/lib64', '/lost+found', '/proc', '/sys'],

      warningRaid0: '_0',
      warningRaid1: '_1',
      warningLV: 'LV',
      warningLogical: 'LOGICAL',
      warningPrimary: 'PRIMARY',
      warningSwap: 'SWAP',
      warningReiserfs: 'REISERFS',
      warningWindows: 'WINDOWS',
      warningBoot: '/boot',
      warningRoot: '/',
      warningCwin: 'c:',
      warningNTFS: 'NTFS',
      warningEXT4: 'EXT_4',
      warningLINUX: 'LINUX',
      warningZFS: 'ZFS',

      swapLabel: 'swap',

      maxSizeSwap: 30000, // = 30Go
      maxSizePartition: 2000000, // =  2To
      minSizePartition: 10, // = 10Mo
      minSizeWindows: 32768, // = 32Go
      minSizeReiserfs: 32, // = 32Mo
      minSizeBoot: 50, // = 50Mo
    };

    $scope.installation = {
      hasData: false, // false if no distribution is available
      // STEP1
      desktopType: [],
      familyType: [],
      distributionList: null,
      warningExistPartition: false, // true if a partition has personnalisation in progress (use if user back in distriction list)
      // STEP1 SELECT
      selectDesktopType: null,
      selectFamily: null,
      selectDistribution: null,
      saveSelectDistribution: null, // save new distribution if a partition has personnalisation in progress (see setSelectDistribution())
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
      dirtyPartition: true, // true if variable partition size has been customized (change to false in loadPartiton())
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
    };

    $scope.informations = {
      totalSize: 0,
      diskSize: 0,
      nbDisk: 0, // Nb of disk use for partitionning. If server has Raid controller, nbDisk = 1, nbPhysicalDisk = n
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

    $scope.newPartition = {
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
      progressColor: null,
    };

    $scope.setPartition = {
      save: null,
      delModel: null,
      indexSet: -1,
    };

    $scope.buttonControl = {
      displayAddConfirmation: false,
      deleteInProgress: false,
      setInProgress: false,
      addInProgress: false,
    };

    $scope.loader = {
      loading: false,
      loadingForm: false,
      loadingCapabilities: false,
    };

    $scope.errorInst = {
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

    $scope.configError = {
      raidDiskUse: false,
    };

    $scope.warning = {
      raid0: false,
    };

    $scope.validation = {
      orderList: [],
      mountPointList: [],
      volumeNameList: [],
      hasSwap: false,
      maxOrder: 0,
    };

    $scope.bar = {
      progress: [],
      total: 0,
    };

    $scope.sshList = [];

    // ------STEP1------
    $scope.load = function () {
      $scope.loader.loading = true;

      const getHardRaid = $scope.getHardwareRaid();
      const getOvhTemplates = Server.getOvhTemplates($stateParams.productId)
        .then((templateList) => {
          $scope.installation.desktopType = templateList.category;
          $scope.installation.familyType = templateList.family;
          $scope.installation.distributionList = templateList.templates.results;
          $scope.installation.selectDesktopType = $scope.installation.desktopType[0];
          $scope.installation.selectFamily = $scope.constants.warningLINUX;
        })
        .catch((data) => {
          $scope.resetAction();
          Alerter.alertFromSWS($translate.instant('server_configuration_installation_ovh_fail_os', { t0: $scope.constants.server.name }), data.data, 'server_dashboard_alert');
        });
      const getSshKeys = Server.getSshKey($stateParams.productId).then((data) => {
        $scope.sshList = data;
      });

      $q.all([getHardRaid, getOvhTemplates, getSshKeys]).finally(() => {
        $scope.loader.loading = false;
      });
    };

    $scope.getCountFilter = function (itemFamily) {
      const tab = $filter('filter')($scope.installation.distributionList, { family: itemFamily, category: $scope.installation.selectDesktopType });
      $scope.countFilter[itemFamily] = tab.length;
      if ($scope.countFilter[itemFamily] > 0) {
        $scope.installation.hasData = true;
      }

      return tab;
    };

    $scope.setSelectDistribution = function (distribution, bypass) {
      // if saveSelectDistribution is not null, a partition has personnalisation in progress and confirmation to delete is already display
      if ($scope.installation.saveSelectDistribution && !bypass) {
        $scope.installation.saveSelectDistribution = distribution;
      } else if (!$scope.installation.saveSelectDistribution && $scope.installation.partitionSchemeModels) {
        // a partition has personnalisation in progress beacause partitionSchemeModels is not null
        $scope.installation.warningExistPartition = true; // confirmation to delete display
        $scope.installation.saveSelectDistribution = distribution; // save new (futur?) distribution
      } else {
        // No partition is currently in personnalisation or confirmation to delete currently partitions (bypass = true)
        $scope.installation.warningExistPartition = false;
        $scope.installation.partitionSchemeModels = null;

        $scope.installation.isHybridCompatible = false;
        $scope.installation.selectDistribution = distribution;

        if (distribution) {
          $scope.loader.loadingCapabilities = true;
          Server.getTemplateCapabilities($stateParams.productId, distribution.id)
            .then((data) => {
              $scope.installation.isHybridCompatible = data.hybridSupport;
              if (!$scope.installation.isHybridCompatible) {
                resetDiskGroup();
              }
            })
            .finally(() => {
              $scope.loader.loadingCapabilities = false;
            });

          $scope.installation.selectLanguage = $scope.installation.selectDistribution.defaultLanguage;
        } else {
          resetDiskGroup();
        }

        $scope.installation.saveSelectDistribution = null;
        $scope.informations.gabaritName = null;
      }

      if ($scope.installation.selectDistribution && $scope.installation.selectDistribution.hardRaidConfiguration === false) {
        $scope.installation.raidSetup = false;
      }
    };

    $scope.cancelSetSelectDistribution = function () {
      $scope.installation.warningExistPartition = false;
      $scope.installation.saveSelectDistribution = null;
    };

    // ------STEP Hard Raid------

    $scope.getHardwareRaid = function () {
      if (!$scope.informations.hardwareRaid.profile) {
        $scope.loader.loading = true;
        return $q.all([getHardwareRaidProfile(), getHardwareSpecification()]).catch((error) => {
          $scope.informations.hardwareRaid.error.wrongLocation = Server.isHardRaidLocationError(error);
          $scope.informations.hardwareRaid.error.notAvailable = Server.isHardRaidUnavailableError(error);
          if (!$scope.informations.hardwareRaid.error.wrongLocation && !$scope.informations.hardwareRaid.error.notAvailable) {
            $scope.resetAction();
            Alerter.alertFromSWS($translate.instant('server_configuration_installation_ovh_stephardraid_loading_error'), error.data, 'server_dashboard_alert');
          }
        });
      }
      return $q.when({});
    };

    function getHardwareRaidProfile() {
      return Server.getHardwareRaidProfile($stateParams.productId).then((raidProfile) => {
        $scope.informations.hardwareRaid.profile = raidProfile;
        if (some(get(raidProfile, 'controllers'))) {
          $scope.installation.hardwareRaid.controller = raidProfile.controllers[0];
        }
      });
    }

    function getHardwareSpecification() {
      return Server.getHardwareSpecifications($stateParams.productId).then((spec) => {
        $scope.informations.diskGroups = spec.diskGroups;
        resetDiskGroup();
      });
    }

    function resetDiskGroup() {
      $scope.installation.diskGroup = $scope.informations.diskGroups[0];
    }

    // ------STEP2------
    $scope.loadPartiton = function () {
      if (!$scope.installation.partitionSchemeModels || $scope.informations.totalSize !== $scope.installation.hardwareRaid.availableSpace) {
        $scope.loader.loading = true;

        // init
        $scope.newPartition.display = false;
        $scope.setPartition.save = null;
        $scope.setPartition.indexSet = -1;
        $scope.setPartition.delModel = null;
        clearError();

        Server.getOvhPartitionSchemesTemplates($stateParams.productId, $scope.installation.selectDistribution.id, $scope.installation.selectLanguage, $scope.informations.customInstall).then(
          (partitionSchemesList) => {
            $scope.installation.partitionSchemesList = partitionSchemesList.results;

            $scope.informations.gabaritName = partitionSchemesList.gabaritName;
            $scope.constants.raidList = partitionSchemesList.partitionRaidEnumMap;
            $scope.constants.fileSystemList = partitionSchemesList.templateOsFileSystemEnum;
            $scope.constants.partitionTypeList = partitionSchemesList.templatePartitionTypeEnum;

            // if hardware Raid
            if ($scope.installation.hardwareRaid.raid) {
              const newPartitioningScheme = {
                name: `hardwareRaid-${$scope.installation.hardwareRaid.raid}`,
                priority: 50,
              };
              return Server.createPartitioningScheme($stateParams.productId, $scope.informations.gabaritName, newPartitioningScheme)
                .then(() => Server.cloneDefaultPartitioningScheme($stateParams.productId, $scope.informations.gabaritName, `hardwareRaid-${$scope.installation.hardwareRaid.raid}`))
                .then(() => {
                  $scope.installation.partitionSchemesList.push(newPartitioningScheme);
                  $scope.installation.partitionSchemesList = sortBy($scope.installation.partitionSchemesList, 'priority');
                  showPartition();
                })
                .catch((error) => {
                  $scope.loader.loading = false;
                  $scope.resetAction();
                  Alerter.alertFromSWS($translate.instant('server_configuration_installation_ovh_stephardraid_loading_error'), error, 'server_dashboard_alert');
                });
            }
            $scope.installation.partitionSchemesList = sortBy($scope.installation.partitionSchemesList, 'priority');
            if ($scope.installation.partitionSchemesList.length > 0) {
              showPartition();
            }
            return null;
          },
          (data) => {
            $scope.loader.loading = false;
            $scope.resetAction();
            Alerter.alertFromSWS($translate.instant('server_configuration_installation_ovh_fail_partition_schemes', { t0: $scope.constants.server.name }), data.data, 'server_dashboard_alert');
          },
        );
      }
    };

    function toBytes(size) {
      let multiplicator = 1;
      switch (size.unit) {
        case 'KB':
          multiplicator = 1024;
          break;
        case 'MB':
          multiplicator = Math.pow(1024, 2); // eslint-disable-line no-restricted-properties
          break;
        case 'GB':
          multiplicator = Math.pow(1024, 3); // eslint-disable-line no-restricted-properties
          break;
        case 'TB':
          multiplicator = Math.pow(1024, 4); // eslint-disable-line no-restricted-properties
          break;
        case 'PB':
          multiplicator = Math.pow(1024, 5); // eslint-disable-line no-restricted-properties
          break;
        case 'EB':
          multiplicator = Math.pow(1024, 6); // eslint-disable-line no-restricted-properties
          break;
        case 'YB':
          multiplicator = Math.pow(1024, 7); // eslint-disable-line no-restricted-properties
          break;
        default:
          break;
      }
      return size.value * multiplicator;
    }

    function showPartition() {
      // Select hight priority partition scheme
      $scope.installation.selectPartitionScheme = $scope.installation.partitionSchemesList[$scope.installation.partitionSchemesList.length - 1];

      // Get Partition list of largest partition scheme
      Server.getOvhPartitionSchemesTemplatesDetail($scope.informations.gabaritName, $scope.installation.selectPartitionScheme.name).then(
        (partitionSchemeModels) => {
          let index = partitionSchemeModels.results.length;

          $scope.loader.loading = false;
          $scope.installation.partitionSchemeModels = partitionSchemeModels.results;

          // get total use size (remainingSize),
          // assign random color
          // rename order by orderTable
          angular.forEach($scope.installation.partitionSchemeModels, (partition, _index) => {
            partition.progressColor = $scope.getRandomColor(_index);
            partition.orderTable = angular.copy(partition.order);
          });

          // if one partition has size = 0 => replace by remaining size
          for (index; index--;) {
            $scope.installation.partitionSchemeModels[index].hasWarning = false;
            if ($scope.installation.partitionSchemeModels[index] && $scope.installation.partitionSchemeModels[index].partitionSize === 0) {
              $scope.installation.partitionSchemeModels[index].partitionSize = getRealRemainingSize($scope.installation.partitionSchemeModels[index].raid);

              // To save information if user change nb disque installation and personnalisation is not dirty
              $scope.installation.partitionSchemeModels[index].isRemainingSizePartition = true;
              $scope.installation.dirtyPartition = false;
              break;
            }
          }

          // for refresh progress bar
          $scope.getRemainingSize();
        },
        (data) => {
          $scope.loader.loading = false;
          $scope.resetAction();
          data.type = 'ERROR';
          $scope.setMessage($translate.instant('server_configuration_installation_ovh_fail_partition_schemes', { t0: $scope.constants.server.name }), data.data);
        },
      );
    }

    // If the diskGroup is not the first disk group, we need to disable raid setup if it is enabled.
    $scope.$watch('installation.diskGroup', (newValue) => {
      if (newValue) {
        if (newValue.diskGroupId !== get($scope.informations.diskGroups[0] || {}, 'diskGroupId')) {
          $scope.installation.raidSetup = false;
        }
        $scope.refreshDiskGroupInfos(newValue);
      }
    });

    $scope.refreshDiskGroupInfos = function (newDiskGroup) {
      $scope.informations.isCachecade = newDiskGroup.raidController === 'cache';
      $scope.informations.raidController = newDiskGroup.raidController !== null;
      $scope.informations.typeDisk = newDiskGroup.diskType;
      $scope.informations.nbPhysicalDisk = newDiskGroup.numberOfDisks;
      $scope.informations.diskSize = Math.round(toBytes(newDiskGroup.diskSize) / 1000 / 1000);
      $scope.informations.nbDisk = newDiskGroup.raidController !== null ? 1 : newDiskGroup.numberOfDisks;
      $scope.installation.nbDiskUse = $scope.informations.nbDisk;

      if ($scope.installation.hardwareRaid.availableSpace) {
        $scope.informations.totalSize = $scope.installation.hardwareRaid.availableSpace;
      } else {
        $scope.informations.totalSize = newDiskGroup.raidController !== null ? Math.round(toBytes(newDiskGroup.diskSize) / 1000 / 1000) : Math.round(toBytes(newDiskGroup.diskSize) / 1000 / 1000) * get(newDiskGroup, 'numberOfDisks', 0);
      }

      const otherDisk = find($scope.informations.diskGroups, diskGroup => diskGroup.diskGroupId !== newDiskGroup.diskGroupId);
      $scope.informations.otherDisk = map(compact([otherDisk]), disk => ({
        typeDisk: disk.diskType,
        nbDisk: disk.numberOfDisks,
        sizeDisk: Math.round(toBytes(disk.diskSize) / 1000 / 1000),
      }));
    };

    $scope.$watch('installation.nbDiskUse', (newValue) => {
      if ($scope.installation.partitionSchemeModels) {
        validationNbDiskUse(newValue);
      }
    });

    // ------Add partition------

    $scope.displayNewPartition = function () {
      const raidList = $scope.getRaidList($scope.installation.nbDiskUse);
      clearError();
      $scope.newPartition.raid = (raidList.length > 0 && raidList[raidList.length - 1]) || $scope.constants.warningRaid1;
      $scope.newPartition.partitionSize = getRealRemainingSize($scope.newPartition.raid);

      if (includes($scope.constants.partitionTypeList, $scope.constants.warningLogical)) {
        $scope.newPartition.typePartition = angular.copy($scope.constants.warningLogical);
      } else {
        $scope.newPartition.typePartition = angular.copy($scope.constants.partitionTypeList[0]);
      }
      if ($scope.installation.selectDistribution.family === $scope.constants.warningWindows) {
        if (includes($scope.constants.fileSystemList, $scope.constants.warningNTFS)) {
          $scope.newPartition.fileSystem = angular.copy($scope.constants.warningNTFS);
        } else {
          $scope.newPartition.fileSystem = angular.copy($scope.constants.fileSystemList[0]);
        }
      } else if (includes($scope.constants.fileSystemList, $scope.constants.warningEXT4)) {
        $scope.newPartition.fileSystem = angular.copy($scope.constants.warningEXT4);
      } else {
        $scope.newPartition.fileSystem = angular.copy($scope.constants.fileSystemList[0]);
      }

      $scope.newPartition.progressColor = $scope.getRandomColor();
      if (validationTypePrimary(true)) {
        $scope.errorInst.typePrimary = true;
      } else if ($scope.installation.selectDistribution.family === $scope.constants.warningWindows && $scope.newPartition.partitionSize < $scope.constants.minSizeWindows) {
        $scope.errorInst.partitionSizeWindows = true;
      } else if ($scope.newPartition.partitionSize < $scope.constants.minSizePartition) {
        $scope.errorInst.partitionSizeToAdd = true;
      } else {
        $scope.newPartition.display = true;
      }
      updateNoAllowProperties();
      $scope.newPartition.order = $scope.validation.maxOrder + 1;
      $scope.getRemainingSize();
    };
    $scope.validAddPartition = function (bypassRaid) {
      let trueSize = 0;
      $scope.buttonControl.addInProgress = true;
      checkall($scope.newPartition);
      if (isValidPartition()) {
        if (!bypassRaid && $scope.warning.raid0) {
          $scope.buttonControl.displayAddConfirmation = true;
          $scope.buttonControl.addInProgress = false;
        } else {
          trueSize = $scope.newPartition.partitionSize;
          if ($scope.newPartition.typePartition !== $scope.constants.warningLV) {
            $scope.newPartition.volumeName = null;
          }

          if ($scope.informations.raidController || $scope.informations.nbDisk === 1) {
            $scope.newPartition.raid = null;
          }

          Server.postAddPartition($scope.informations.gabaritName, $scope.installation.selectPartitionScheme.name, {
            raid: $scope.newPartition.raid,
            fileSystem: $scope.newPartition.fileSystem,
            typePartition: $scope.newPartition.typePartition,
            volumeName: $scope.newPartition.volumeName,
            order: $scope.newPartition.order,
            mountPoint: $scope.newPartition.mountPoint,
            oldMountPoint: $scope.newPartition.mountPoint,
            partitionSize: trueSize,
          }).then(
            () => {
              $scope.warning.raid0 = false;
              $scope.newPartition.partitionSize = trueSize;
              $scope.newPartition.orderTable = angular.copy($scope.newPartition.order);
              $scope.installation.partitionSchemeModels.push(angular.copy($scope.newPartition));

              $scope.newPartition.order = null;
              $scope.newPartition.typePartition = null;
              $scope.newPartition.fileSystem = null;
              $scope.newPartition.mountPoint = null;
              $scope.newPartition.volumeName = null;
              $scope.newPartition.raid = null;
              $scope.newPartition.partitionSize = null;

              $scope.newPartition.display = false;

              $scope.buttonControl.displayAddConfirmation = false;
              $scope.buttonControl.addInProgress = false;
              clearError();
              $scope.refreshBar();
              validationNbDiskUse($scope.installation.nbDiskUse);
            },
            (data) => {
              $scope.buttonControl.addInProgress = false;
              $scope.errorInst.ws = $translate.instant('server_configuration_installation_ovh_step2_error_add', {
                t0: $scope.newPartition.mountPoint,
                t1: data.data.message,
              });
            },
          );
        }
      } else {
        $scope.buttonControl.addInProgress = false;
      }
      $scope.getRemainingSize();
    };
    $scope.cancelAddPartition = function () {
      $scope.newPartition.display = false;
      $scope.getRemainingSize();
      clearError();
    };

    // ------Set partition------

    $scope.displaySetPartition = function (partition) {
      // Use index for save what partition is changed
      const index = getIndexOfPartition(partition);
      clearError();
      $scope.setPartition.indexSet = index;
      $scope.setPartition.save = angular.copy($scope.installation.partitionSchemeModels[index]);
      updateNoAllowProperties(partition);
      $scope.getRemainingSize();
    };
    $scope.validSetPartition = function (bypassRaid) {
      const partitionToSet = $scope.installation.partitionSchemeModels[$scope.setPartition.indexSet];
      let trueSize = 0;
      $scope.buttonControl.setInProgress = true;
      checkall(partitionToSet);
      if (isValidPartition()) {
        if (!bypassRaid && $scope.warning.raid0) {
          $scope.buttonControl.displayAddConfirmation = true;
          $scope.buttonControl.setInProgress = false;
        } else {
          trueSize = partitionToSet.partitionSize;
          if (partitionToSet.typePartition !== $scope.constants.warningLV) {
            partitionToSet.volumeName = null;
          }

          Server.putSetPartition($scope.informations.gabaritName, $scope.installation.selectPartitionScheme.name, {
            raid: partitionToSet.raid,
            fileSystem: partitionToSet.fileSystem,
            typePartition: partitionToSet.typePartition,
            volumeName: partitionToSet.volumeName,
            order: partitionToSet.order,
            mountPoint: partitionToSet.mountPoint,
            oldMountPoint: $scope.setPartition.save.mountPoint,
            partitionSize: trueSize,
          }).then(
            () => {
              if (partitionToSet.isRemainingSizePartition) {
                $scope.installation.dirtyPartition = true;
              }
              $scope.warning.raid0 = false;

              partitionToSet.partitionSize = trueSize;
              partitionToSet.orderTable = angular.copy(partitionToSet.order);

              $scope.setPartition.save = null;
              $scope.setPartition.indexSet = -1;

              $scope.buttonControl.displayAddConfirmation = false;
              $scope.buttonControl.setInProgress = false;
              clearError();
              validationNbDiskUse($scope.installation.nbDiskUse);
            },
            (data) => {
              $scope.buttonControl.setInProgress = false;
              $scope.errorInst.ws = $translate.instant('server_configuration_installation_ovh_step2_error_set', {
                t0: partitionToSet.mountPoint,
                t1: data.message,
              });
            },
          );
        }
      } else {
        $scope.buttonControl.setInProgress = false;
      }
      $scope.getRemainingSize();
    };
    $scope.cancelSetPartition = function () {
      $scope.installation.partitionSchemeModels[$scope.setPartition.indexSet] = angular.copy($scope.setPartition.save);
      $scope.setPartition.save = null;
      $scope.setPartition.indexSet = -1;
      $scope.getRemainingSize();
      clearError();
    };

    // ------Delete partition------

    $scope.deletePartition = function (partition) {
      $scope.setPartition.delModel = getIndexOfPartition(partition);
      $scope.getRemainingSize();
    };
    $scope.deleteValidPartition = function () {
      $scope.buttonControl.deleteInProgress = true;
      Server.deleteSetPartition($scope.informations.gabaritName, $scope.installation.selectPartitionScheme.name, $scope.installation.partitionSchemeModels[$scope.setPartition.delModel].mountPoint).then(
        () => {
          if ($scope.installation.partitionSchemeModels[$scope.setPartition.delModel].isRemainingSizePartition) {
            $scope.installation.dirtyPartition = true;
          }
          $scope.installation.partitionSchemeModels.splice($scope.setPartition.delModel, 1);
          $scope.setPartition.delModel = null;
          $scope.getRemainingSize();
          $scope.buttonControl.deleteInProgress = false;
          clearError();
          validationNbDiskUse($scope.installation.nbDiskUse);
        },
        (data) => {
          $scope.buttonControl.deleteInProgress = false;
          $scope.errorInst.ws = $translate.instant('server_configuration_installation_ovh_step2_error_delete', {
            t0: $scope.setPartition.delModel.mountPoint,
            t1: data.data.message,
          });
        },
      );
    };
    $scope.deleteCancelPartition = function () {
      $scope.setPartition.delModel = null;
      $scope.getRemainingSize();
    };

    // ------Common partition------

    $scope.cancelRaid0Partition = function () {
      $scope.buttonControl.displayAddConfirmation = false;
      $scope.getRemainingSize();
    };

    $scope.validPartition = function () {
      if ($scope.newPartition.display && !$scope.buttonControl.addInProgress) {
        $scope.validAddPartition(true);
      } else if (!$scope.buttonControl.setInProgress && $scope.setPartition.save) {
        $scope.validSetPartition(true);
      }
    };

    // ------VALIDATION------

    function isValidPartition() {
      return !$scope.hasErrorOrder() && !$scope.hasErrorType() && !$scope.hasErrorFileSystem() && !$scope.hasErrorMountPoint() && !$scope.hasErrorVolumeName() && !$scope.hasErrorRaid() && !$scope.hasErrorSize();
    }

    function checkall(partition) {
      $scope.validationMountPoint(partition);

      // $scope.validationOrder // load by validationMountPoint
      // $scope.validationType //load by validationOrder
      // $scope.validationRaid(partition); //load by /$scope.validationType
      $scope.validationVolumeName(partition);
      $scope.validationFileSystem(partition);

      // $scope.validationSize //load by validationRaid
    }

    // ------ORDER VALIDATION------

    $scope.hasErrorOrder = function () {
      return $scope.errorInst.order || $scope.errorInst.orderFirst || $scope.errorInst.orderType || $scope.errorInst.orderFirstWin;
    };
    $scope.validationOrder = function (partition) {
      let firstPartition = partition;
      let hasBoot = false;

      if (!partition.order) {
        if ($scope.newPartition.display) {
          partition.order = $scope.installation.partitionSchemeModels.length + 1;
        } else {
          partition.order = angular.copy($scope.setPartition.save.order);
        }
      }
      $scope.errorInst.order = $scope.validation.orderList[partition.order];

      if (!$scope.errorInst.order) {
        angular.forEach($scope.installation.partitionSchemeModels, (partition2) => {
          if (partition2.order < firstPartition.order) {
            firstPartition = partition2;
          }
          if (partition2.mountPoint === $scope.constants.warningBoot) {
            hasBoot = true;
          }
        });
        if ($scope.newPartition.display) {
          if (partition.mountPoint === $scope.constants.warningBoot) {
            hasBoot = true;
          }
        }
        if ($scope.installation.selectDistribution.family !== $scope.constants.warningWindows) {
          $scope.errorInst.orderFirst = (hasBoot && firstPartition.mountPoint !== $scope.constants.warningBoot) || (!hasBoot && firstPartition.mountPoint !== $scope.constants.warningRoot && firstPartition.mountPoint !== $scope.constants.warningBoot);
        } else {
          $scope.errorInst.orderFirstWin = firstPartition.mountPoint !== $scope.constants.warningCwin;
        }
      }
      $scope.validationType(partition);
    };

    // ------TYPE VALIDATION------

    $scope.hasErrorType = function () {
      return $scope.errorInst.orderType || $scope.errorInst.typePrimary || $scope.errorInst.typeLvSwap || $scope.errorInst.typeLogicalLv || $scope.errorInst.mountPointPrimary;
    };
    $scope.validationType = function (partition) {
      let nbLv = 0;
      let nbLogical = 0;

      $scope.errorInst.typeLvSwap = partition.typePartition === $scope.constants.warningLV && partition.fileSystem === $scope.constants.warningSwap;

      if ($scope.installation.selectDistribution.family === $scope.constants.warningWindows && partition.mountPoint === $scope.constants.warningCwin) {
        $scope.errorInst.mountPointPrimary = partition.typePartition !== $scope.constants.warningPrimary;
      } else {
        $scope.errorInst.mountPointPrimary = false;
      }

      $scope.errorInst.orderType = false;

      // $scope.errorInst.orderLv = false;
      $scope.errorInst.typeLogicalLv = false;
      if (!$scope.errorInst.order && !$scope.errorInst.orderFirst && !$scope.errorInst.typeLvSwap && !$scope.errorInst.mountPointPrimary) {
        angular.forEach($scope.installation.partitionSchemeModels, (partition2) => {
          // Primary first Test
          if (
            (partition2.order < partition.order && partition2.typePartition !== $scope.constants.warningPrimary && partition.typePartition === $scope.constants.warningPrimary)
                            || (partition2.order > partition.order && partition2.typePartition === $scope.constants.warningPrimary && partition.typePartition !== $scope.constants.warningPrimary)
          ) {
            $scope.errorInst.orderType = true;
          }
          if (partition2.typePartition === $scope.constants.warningLV) {
            nbLv++;
          } else if (partition2.typePartition === $scope.constants.warningLogical) {
            nbLogical++;
          }
        });
        if ($scope.newPartition.display) {
          if (partition.typePartition === $scope.constants.warningLV) {
            nbLv++;
          } else if (partition.typePartition === $scope.constants.warningLogical) {
            nbLogical++;
          }
        }
        if (nbLv !== 0 && nbLogical !== 0) {
          $scope.errorInst.typeLogicalLv = true;
        }
      }

      $scope.errorInst.typePrimary = !$scope.errorInst.orderType && validationTypePrimary();
      $scope.validationRaid(partition);
      validationVolumeNameByType(partition);
    };
    function validationTypePrimary(forNewPartition) {
      let nbPrimary = 0;
      let nbOther = 0;

      angular.forEach($scope.installation.partitionSchemeModels, (partition2) => {
        if (partition2.typePartition === $scope.constants.warningPrimary) {
          nbPrimary++;
        } else {
          nbOther++;
        }
      });
      if (forNewPartition) {
        return nbPrimary === 4;
      }
      return (nbPrimary === 4 && nbOther > 0) || nbPrimary > 4;
    }

    // ------FILE SYSTEM VALIDATION------

    $scope.hasErrorFileSystem = function () {
      return $scope.errorInst.fileSystemSwap || $scope.errorInst.fileSystemNoSwap;
    };
    $scope.validationFileSystem = function (partition) {
      $scope.errorInst.fileSystemSwap = $scope.validation.hasSwap && partition.fileSystem === $scope.constants.warningSwap;
      $scope.errorInst.fileSystemNoSwap = $scope.installation.selectDistribution.family !== $scope.constants.warningWindows && !$scope.validation.hasSwap && partition.fileSystem !== $scope.constants.warningSwap;
      if (!$scope.errorInst.fileSystemSwap) {
        if (partition.fileSystem === $scope.constants.warningSwap) {
          partition.mountPoint = $scope.constants.swapLabel;
          $scope.validationMountPoint(partition);
        }
        $scope.validationSize(partition);
      }
    };

    // ------MOUNT POINT VALIDATION------

    $scope.hasErrorMountPoint = function () {
      return (
        $scope.errorInst.mountPointUse
                    || $scope.errorInst.mountPointEmpty
                    || $scope.errorInst.mountPoint
                    || $scope.errorInst.mountPoint2
                    || $scope.errorInst.mountPointWindows
                    || $scope.errorInst.orderFirst
                    || $scope.errorInst.orderFirstWin
      );
    };
    $scope.validationMountPoint = function (partition) {
      $scope.errorInst.mountPointEmpty = !partition.mountPoint;
      $scope.errorInst.mountPointUse = !$scope.errorInst.mountPointEmpty && $scope.validation.mountPointList[partition.mountPoint.toLowerCase()];

      if (partition.fileSystem !== $scope.constants.warningSwap) {
        if ($scope.installation.selectDistribution.family !== $scope.constants.warningWindows) {
          $scope.errorInst.mountPoint = !$scope.errorInst.mountPointEmpty
                            && !$scope.errorInst.mountPointUse
                            && (!!~$scope.constants.forbiddenMountPoint.indexOf(partition.mountPoint.toLowerCase())
                            || /\/\.{1,2}(\/|$)/.test(partition.mountPoint) // /../
                            || /\/\-/.test(partition.mountPoint) // /-
                            || /\/\//.test(partition.mountPoint) // //
                                || !/^\/[A-Za-z0-9\._\-\/]{0,254}$/.test(partition.mountPoint));

          $scope.errorInst.mountPoint2 = !$scope.errorInst.mountPointEmpty
                            && !$scope.errorInst.mountPointUse
                            && !$scope.errorInst.mountPoint
                            && /^\/var\/log/.test(partition.mountPoint.toLowerCase())
                            && /^(ovh|gentoo-ovh_64|gentoo-ovh)$/.test($scope.installation.selectDistribution.family);
        } else if ($scope.installation.selectDistribution.family === $scope.constants.warningWindows) {
          $scope.errorInst.mountPointWindows = !$scope.errorInst.mountPointEmpty && !$scope.errorInst.mountPointUse && !/^[c-z]\:$/.test(partition.mountPoint.toLowerCase());
        }
      } else {
        $scope.errorInst.mountPoint = false;
        $scope.errorInst.mountPoint2 = false;
        $scope.errorInst.mountPointWindows = false;
      }
      $scope.validationOrder(partition);
    };

    // ------VOLUME NAME VALIDATION------

    $scope.hasErrorVolumeName = function () {
      return $scope.errorInst.volumeNameEmpty || $scope.errorInst.volumeName || $scope.errorInst.volumeNameUse;
    };
    $scope.validationVolumeName = function (partition) {
      validationVolumeNameByType(partition);
      $scope.errorInst.volumeName = !$scope.errorInst.typeLvSwap
                    && !$scope.errorInst.typeLogicalLv
                    && !$scope.errorInst.volumeNameEmpty
                    && partition.typePartition === $scope.constants.warningLV
                    && (!/^[a-zA-Z0-9]{1,16}$/.test(partition.volumeName) || partition.volumeName.toLowerCase() === 'snapshot' || partition.volumeName.toLowerCase() === 'pvmove');
      $scope.errorInst.volumeNameUse = !$scope.errorInst.typeLvSwap
                    && !$scope.errorInst.typeLogicalLv
                    && !$scope.errorInst.volumeNameEmpty
                    && !$scope.errorInst.volumeName
                    && partition.typePartition === $scope.constants.warningLV
                    && $scope.validation.volumeNameList[partition.volumeName.toLowerCase()];
    };
    function validationVolumeNameByType(partition) {
      $scope.errorInst.volumeNameEmpty = !$scope.errorInst.typeLvSwap && !$scope.errorInst.typeLogicalLv && partition.typePartition === $scope.constants.warningLV && (!partition.volumeName || partition.volumeName === '');
    }

    // ------Soft RAID VALIDATION------

    $scope.hasErrorRaid = function () {
      return $scope.errorInst.raid0 || $scope.errorInst.raidLv;
    };
    $scope.validationRaid = function (partition) {
      $scope.errorInst.raidLv = false;
      if ($scope.installation.nbDiskUse > 1 && !$scope.informations.raidController) {
        $scope.errorInst.raid0 = partition.raid !== $scope.constants.warningRaid1 && partition.raid !== $scope.constants.warningRaid0 && (partition.mountPoint === $scope.constants.warningBoot || partition.mountPoint === $scope.constants.warningRoot);
        $scope.warning.raid0 = !$scope.errorInst.raid0 && partition.raid === $scope.constants.warningRaid0 && partition.fileSystem !== $scope.constants.warningSwap;
      }
      if ($scope.installation.nbDiskUse > 1 && !$scope.informations.raidController && partition.typePartition === $scope.constants.warningLV) {
        angular.forEach($scope.installation.partitionSchemeModels, (partition2) => {
          if (partition2.typePartition === $scope.constants.warningLV && partition2.raid !== partition.raid) {
            $scope.errorInst.raidLv = true;
          }
        });
      }

      $scope.validationSize(partition);
    };
    function validationNbDiskUse(nbDisk) {
      let index = $scope.installation.partitionSchemeModels.length;
      let indexVarPartition = null;
      const raidList = $scope.getRaidList(nbDisk);

      $scope.configError.raidDiskUse = false;

      if (nbDisk !== 1) {
        for (index; index--;) {
          if (!$scope.installation.dirtyPartition && indexVarPartition === null && $scope.installation.partitionSchemeModels[index] && $scope.installation.partitionSchemeModels[index].isRemainingSizePartition) {
            indexVarPartition = index;
          }
          if ($scope.informations.nbDisk > 2 && !includes(raidList, $scope.installation.partitionSchemeModels[index].raid)) {
            $scope.configError.raidDiskUse = true;
            $scope.installation.partitionSchemeModels[index].hasWarning = true;
          } else {
            $scope.installation.partitionSchemeModels[index].hasWarning = false;
          }
        }
      }

      if (!$scope.installation.hardwareRaid.raid) {
        $scope.informations.totalSize = $scope.informations.diskSize * $scope.installation.nbDiskUse;
      }

      if (!$scope.configError.raidDiskUse && indexVarPartition !== null) {
        $scope.installation.partitionSchemeModels[indexVarPartition].partitionSize = 0;
        $scope.installation.partitionSchemeModels[indexVarPartition].partitionSize = getRealRemainingSize($scope.installation.partitionSchemeModels[indexVarPartition].raid);
      }

      $scope.getRemainingSize();
    }

    // ------SIZE VALIDATION------

    $scope.hasErrorSize = function () {
      return (
        $scope.errorInst.partitionSizeOver
                    || $scope.errorInst.partitionSizeSwap
                    || $scope.errorInst.partitionSize
                    || $scope.errorInst.partitionSizeBoot
                    || $scope.errorInst.partitionSizeReiserfs
                    || $scope.errorInst.partitionSizeWindows
                    || $scope.errorInst.partitionSizeMin
                    || $scope.errorInst.partitionSizeRequired
      );
    };
    $scope.validationSize = function (partition) {
      if (partition.partitionSize) {
        partition.partitionSize = parseInt(partition.partitionSize.toString().replace('.', ''), 10);
      }
      $scope.errorInst.partitionSizeRequired = !/^[0-9]{1,20}$/.test(partition.partitionSize);

      $scope.getRemainingSize();
      return (
        $scope.errorInst.partitionSizeOver
                    || validationSizeSwap(partition)
                    || validationSizeMax(partition)
                    || validationSizeBoot(partition)
                    || validationSizeReiserfs(partition)
                    || validationSizeWindowsMin(partition)
                    || validationSizeMin(partition)
      );
    };

    // swap size > 30Go = error
    function validationSizeSwap(partition) {
      $scope.errorInst.partitionSizeSwap = partition.fileSystem === $scope.constants.warningSwap && $scope.getRealDisplaySize({ partition, notDisplay: true, noRaid: true }) > $scope.constants.maxSizeSwap;
      return $scope.errorInst.partitionSizeSwap;
    }

    // partition size > 2To = error
    function validationSizeMax(partition) {
      $scope.errorInst.partitionSize = partition.fileSystem !== $scope.constants.warningZFS && !$scope.installation.selectDistribution.supportsGpt && $scope.getRealDisplaySize({ partition, notDisplay: true, noRaid: true }) > $scope.constants.maxSizePartition;
      return $scope.errorInst.partitionSize;
    }

    // boot size < 50Mo = error
    function validationSizeBoot(partition) {
      $scope.errorInst.partitionSizeBoot = partition.mountPoint === $scope.constants.warningBoot && $scope.getRealDisplaySize({ partition, notDisplay: true, noRaid: true }) < $scope.constants.minSizeBoot;
      return $scope.errorInst.partitionSizeBoot;
    }

    // reiserfs size < 32Mo = error
    function validationSizeReiserfs(partition) {
      $scope.errorInst.partitionSizeReiserfs = partition.fileSystem === $scope.constants.warningReiserfs && $scope.getRealDisplaySize({ partition, notDisplay: true, noRaid: true }) < $scope.constants.minSizeReiserfs;
      return $scope.errorInst.partitionSizeReiserfs;
    }

    // windows size < 20Go = error
    function validationSizeWindowsMin(partition) {
      $scope.errorInst.partitionSizeWindows = $scope.installation.selectDistribution.family === $scope.constants.warningWindows && $scope.getRealDisplaySize({ partition, notDisplay: true, noRaid: true }) < $scope.constants.minSizeWindows;
      return $scope.errorInst.partitionSizeWindows;
    }

    // partition size < 10Mo = error
    function validationSizeMin(partition) {
      $scope.errorInst.partitionSizeMin = $scope.getRealDisplaySize({ partition, notDisplay: true, noRaid: true }) < $scope.constants.minSizePartition;
      return $scope.errorInst.partitionSizeMin;
    }

    // ------END VALIDATION------

    // ------VALIDATION TOOLS------
    // Create table of boolean with key = the propertie and value = true because this propertie is already use
    function updateNoAllowProperties(excludedPartition) {
      $scope.validation.orderList = [];
      $scope.validation.mountPointList = [];
      $scope.validation.volumeNameList = [];
      $scope.validation.hasSwap = false;
      $scope.validation.maxOrder = 0;
      angular.forEach($scope.installation.partitionSchemeModels, (partition) => {
        if ($scope.validation.maxOrder < partition.order) {
          $scope.validation.maxOrder = partition.order;
        }
        if (!excludedPartition || excludedPartition.order !== partition.order) {
          $scope.validation.orderList[partition.order] = true;
        }
        if (!excludedPartition || excludedPartition.mountPoint !== partition.mountPoint) {
          $scope.validation.mountPointList[partition.mountPoint.toLowerCase()] = true;
        }
        if (partition.volumeName && (!excludedPartition || excludedPartition.volumeName !== partition.volumeName)) {
          $scope.validation.volumeNameList[partition.volumeName.toLowerCase()] = true;
        }
        if (partition.fileSystem === $scope.constants.warningSwap && (!excludedPartition || excludedPartition.fileSystem !== $scope.constants.warningSwap)) {
          $scope.validation.hasSwap = true;
        }
      });
    }

    // Delete all Error message after cancel action
    function clearError() {
      angular.forEach($scope.warning, (value, key) => {
        $scope.warning[key] = false;
      });
      angular.forEach($scope.errorInst, (value, key) => {
        $scope.errorInst[key] = false;
      });
    }

    // ------END VALIDATION TOOLS------

    // ------TOOLS------

    // return range between 1 and nbdisque of server if > 1
    $scope.getNbDisqueList = function (nbdisk) {
      if (nbdisk > 1) {
        return range(1, nbdisk + 1);
      }
      return [nbdisk];
    };

    // return list of available raid
    $scope.getRaidList = function (nbDisk) {
      if (nbDisk !== null && $scope.constants.raidList !== null) {
        if (nbDisk >= 4) {
          if (nbDisk % 2 === 0) {
            return $scope.constants.raidList[4] || [];
          }
          return $scope.constants.raidList[3] || [];
        }
        return $scope.constants.raidList[nbDisk] || [];
      }
      return [];
    };

    // Get index in partitionSchemeModels table where partition is located
    function getIndexOfPartition(partition) {
      let index = $scope.installation.partitionSchemeModels.length;
      for (index; index--;) {
        if ($scope.installation.partitionSchemeModels[index] && $scope.installation.partitionSchemeModels[index].order && $scope.installation.partitionSchemeModels[index].order === partition.order) {
          break;
        }
      }
      return index;
    }

    // Reture true if partition is in edit mode
    $scope.isSetPartition = function (partition) {
      return $scope.installation.partitionSchemeModels[$scope.setPartition.indexSet] === partition;
    };

    // get real use size for partition with 0 in size (in fact remaining size)
    function getRealRemainingSize(raid) {
      const remainingSize = $scope.getRemainingSize();
      let realRemainingSize = 0;

      if (!isNaN(remainingSize)) {
        if ($scope.installation.nbDiskUse === 1 || $scope.informations.raidController) {
          realRemainingSize = remainingSize;
        } else if (raid) {
          switch (raid) {
            case '_0':
              realRemainingSize = remainingSize;
              break;
            case '_1':
              realRemainingSize = remainingSize / $scope.installation.nbDiskUse;
              break;
            case '_5':
              realRemainingSize = remainingSize - (remainingSize / $scope.installation.nbDiskUse);
              break;
            case '_6':
              realRemainingSize = remainingSize - ((remainingSize / $scope.installation.nbDiskUse) * 2);
              break;
            case '_10':
              realRemainingSize = remainingSize / ($scope.installation.nbDiskUse / 2);
              break;
            default:
              break;
          }
        }
      }

      if (!$scope.installation.selectDistribution.supportsGpt && realRemainingSize > $scope.constants.maxSizePartition) {
        return $scope.constants.maxSizePartition;
      }

      return realRemainingSize;
    }

    // Display size with unit (recursive)
    $scope.getDisplaySize = function (octetsSize, _unitIndex) {
      let unitIndex = _unitIndex;
      if (!isNaN(octetsSize)) {
        if (isNaN(unitIndex)) {
          unitIndex = 0;
        }
        if (octetsSize >= 1000 && unitIndex < $scope.units.model.length - 1) {
          return $scope.getDisplaySize(octetsSize / 1000, unitIndex + 1);
        }
        return `${parseFloat(octetsSize).toFixed(1)} ${$translate.instant(`unit_size_${$scope.units.model[unitIndex].label}`)}`;
      }
      return '';
    };

    $scope.getFullSize = function (partition) {
      partition.partitionSize = 0; // important
      partition.partitionSize = getRealRemainingSize(partition.raid);
      $scope.validationSize(partition);
    };

    // Display real space depending on the raid. if setting or adding,
    // {partition, notDisplay, noRaid}
    $scope.getRealDisplaySize = function (option) {
      if (option.partition && option.partition.takeRemainingSpace) {
        return $scope.getDisplaySize($scope.getRemainingSize());
      }
      if (option.partition && !isNaN(option.partition.partitionSize)) {
        if (option.noRaid || $scope.installation.nbDiskUse === 1 || $scope.informations.raidController) {
          option.partition.realSize = option.partition.partitionSize;
        } else if (option.partition.raid) {
          switch (option.partition.raid) {
            case '_0':
              option.partition.realSize = option.partition.partitionSize;
              break;
            case '_1':
              option.partition.realSize = option.partition.partitionSize * $scope.installation.nbDiskUse;
              break;
            case '_5':
              option.partition.realSize = option.partition.partitionSize + (option.partition.partitionSize / ($scope.installation.nbDiskUse - 1));
              break;
            case '_6':
              option.partition.realSize = option.partition.partitionSize * 2;
              break;
            case '_10':
              option.partition.realSize = option.partition.partitionSize * ($scope.installation.nbDiskUse / 2);
              break;
            default:
              break;
          }
        }
        if (option.notDisplay) {
          return option.partition.realSize;
        }
        return $scope.getDisplaySize(option.partition.realSize);
      }
      return null;
    };

    // get remaining size
    $scope.getRemainingSize = function () {
      let remainingSize = $scope.informations.totalSize;

      // all partition
      angular.forEach($scope.installation.partitionSchemeModels, (partition) => {
        if (partition.partitionSize) {
          remainingSize -= $scope.getRealDisplaySize({ partition, notDisplay: true });
        }
      });

      // new partition
      if ($scope.newPartition.display && !isNaN($scope.newPartition.partitionSize)) {
        remainingSize -= $scope.getRealDisplaySize({ partition: $scope.newPartition, notDisplay: true });
      }

      // delete partition
      if ($scope.setPartition.delModel && $scope.installation.partitionSchemeModels[$scope.setPartition.delModel] && !isNaN($scope.installation.partitionSchemeModels[$scope.setPartition.delModel].partitionSize)) {
        remainingSize += $scope.getRealDisplaySize({ partition: $scope.installation.partitionSchemeModels[$scope.setPartition.delModel], notDisplay: true });
      }

      $scope.informations.remainingSize = remainingSize;
      $scope.errorInst.partitionSizeOver = false;

      if (remainingSize < 0) {
        $scope.errorInst.partitionSizeOver = true;
        $scope.informations.remainingSize = 0;
      }
      $scope.refreshBar();

      return $scope.informations.remainingSize;
    };

    $scope.getRandomColor = function (index, partition) {
      const colorSequence = ['#E91E63', '#3F51B5', '#00BCD4', '#8BC34A', '#FFC107', '#795548', '#9C27B0', '#2196F3', '#009688', '#CDDC39', '#FF9800', '#607D8B'];

      let color = colorSequence[Math.floor(Math.random() * (colorSequence.length - 1))];
      if (index) {
        color = colorSequence[(colorSequence.length - index) % colorSequence.length];
      }

      if (partition) {
        partition.progressColor = color;
      }
      return color;
    };

    $scope.$watch('installation.partitionSchemeModels', () => {
      $scope.refreshBar();
    });

    $scope.refreshBar = function () {
      $scope.bar.progress = [];
      $scope.bar.total = 0;

      angular.forEach($scope.installation.partitionSchemeModels, (partition) => {
        getProgress(partition);
      });
      if ($scope.newPartition.display) {
        getProgress($scope.newPartition);
      }
    };

    function getBarWidth(partition) {
      return parseFloat($scope.getRealDisplaySize({ partition, notDisplay: true }) * 100 / $scope.informations.totalSize).toFixed(1);
    }

    function getProgress(partition) {
      let progress = parseFloat(getBarWidth(partition));
      if ($scope.bar.total < 100.0) {
        if (progress + $scope.bar.total > 100.0) {
          progress = 100.0 - $scope.bar.total;
        }
        $scope.bar.progress.push({
          partition,
          progressSize: progress,
        });
      }
      $scope.bar.total = $scope.bar.total + progress;
    }

    // ------ HARDWARE RAID TOOL--------
    $scope.$watch('installation.hardwareRaid.controller', () => {
      $scope.clearHardwareRaidSpace();
      $scope.recalculateAvailableRaid();
    });

    $scope.$watch('installation.hardwareRaid.raid', () => {
      $scope.clearHardwareRaidSpace();
      $scope.recalculateAvailableRaidDisks();
    });

    $scope.$watch('installation.hardwareRaid.disks', () => {
      $scope.clearHardwareRaidSpace();
      $scope.recalculateAvailableArrays();
    });

    $scope.$watch('installation.hardwareRaid.arrays', () => {
      $scope.recalculateSpace();
      if ($scope.installation.hardwareRaid.disks && $scope.installation.hardwareRaid.arrays) {
        $scope.installation.hardwareRaid.error = $scope.invalidHardRaid();
      }
    });

    $scope.recalculateAvailableRaid = function () {
      if ($scope.installation.hardwareRaid.controller) {
        const nbOfDisk = $scope.installation.hardwareRaid.controller.disks[0].names.length;
        $scope.installation.hardwareRaid.raid = null;
        $scope.informations.hardwareRaid.availableDisks = [];
        $scope.informations.hardwareRaid.availableRaids = [];

        for (let i = 1; i < nbOfDisk + 1; i++) {
          $scope.informations.hardwareRaid.availableDisks.push(i);
        }
        if (nbOfDisk >= 8) {
          $scope.informations.hardwareRaid.availableRaids.push(TEMPLATE_OS_HARDWARE_RAID_ENUM.raid60);
        }
        if (nbOfDisk >= 6) {
          $scope.informations.hardwareRaid.availableRaids.push(TEMPLATE_OS_HARDWARE_RAID_ENUM.raid50);
        }
        if (nbOfDisk >= 4) {
          $scope.informations.hardwareRaid.availableRaids.push(TEMPLATE_OS_HARDWARE_RAID_ENUM.raid6);
          $scope.informations.hardwareRaid.availableRaids.push(TEMPLATE_OS_HARDWARE_RAID_ENUM.raid10);
        }
        if (nbOfDisk >= 3) {
          $scope.informations.hardwareRaid.availableRaids.push(TEMPLATE_OS_HARDWARE_RAID_ENUM.raid5);
        }
        if (nbOfDisk >= 2) {
          $scope.informations.hardwareRaid.availableRaids.push(TEMPLATE_OS_HARDWARE_RAID_ENUM.raid1);
          $scope.informations.hardwareRaid.availableRaids.push(TEMPLATE_OS_HARDWARE_RAID_ENUM.raid0);
        }
      }
    };

    $scope.recalculateAvailableRaidDisks = function () {
      if ($scope.installation.hardwareRaid.controller) {
        const nbOfDisk = $scope.installation.hardwareRaid.controller.disks[0].names.length;
        let minDisks = 1;
        let minDisksPerArray = 1;
        $scope.informations.hardwareRaid.availableDisks = [];
        $scope.installation.hardwareRaid.disks = null;

        switch ($scope.installation.hardwareRaid.raid) {
          case TEMPLATE_OS_HARDWARE_RAID_ENUM.raid60:
            minDisks = 8;
            minDisksPerArray = 4;
            break;
          case TEMPLATE_OS_HARDWARE_RAID_ENUM.raid50:
            minDisks = 6;
            minDisksPerArray = 3;
            break;
          case TEMPLATE_OS_HARDWARE_RAID_ENUM.raid10:
            minDisksPerArray = 2;
            minDisks = 4;
            break;
          case TEMPLATE_OS_HARDWARE_RAID_ENUM.raid6:
            minDisks = 4;
            break;
          case TEMPLATE_OS_HARDWARE_RAID_ENUM.raid5:
            minDisks = 3;
            break;
          case TEMPLATE_OS_HARDWARE_RAID_ENUM.raid1:
            minDisks = 2;
            break;
          case TEMPLATE_OS_HARDWARE_RAID_ENUM.raid0:
            minDisks = 2;
            break;
          default:
            minDisks = 1;
        }

        for (let i = minDisks; i < nbOfDisk + 1; i += minDisksPerArray) {
          $scope.informations.hardwareRaid.availableDisks.push(i);
        }
      }
    };

    $scope.recalculateAvailableArrays = function () {
      if ($scope.installation.hardwareRaid.disks && $scope.installation.hardwareRaid.controller) {
        let maxNumberArray = $scope.installation.hardwareRaid.controller.disks[0].names.length;
        let minNumberArray = 1;
        let isMultipleArrays = false;
        $scope.informations.hardwareRaid.availableArrays = [];
        $scope.installation.hardwareRaid.arrays = null;

        switch ($scope.installation.hardwareRaid.raid) {
          case TEMPLATE_OS_HARDWARE_RAID_ENUM.raid60:
            maxNumberArray = $scope.installation.hardwareRaid.disks / 4;
            minNumberArray = 2;
            isMultipleArrays = true;
            break;
          case TEMPLATE_OS_HARDWARE_RAID_ENUM.raid50:
            maxNumberArray = $scope.installation.hardwareRaid.disks / 3;
            minNumberArray = 2;
            isMultipleArrays = true;
            break;
          case TEMPLATE_OS_HARDWARE_RAID_ENUM.raid10:
            maxNumberArray = $scope.installation.hardwareRaid.disks / 2;
            minNumberArray = 2;
            isMultipleArrays = true;
            break;
          default:
            break;
        }

        if (isMultipleArrays) {
          for (let i = minNumberArray; i <= maxNumberArray; i++) {
            if ($scope.installation.hardwareRaid.disks % i === 0) {
              $scope.informations.hardwareRaid.availableArrays.push(i);
            }
          }
        } else {
          $scope.informations.hardwareRaid.availableArrays = [1];
          $scope.installation.hardwareRaid.arrays = 1;
          $scope.recalculateSpace();
        }
      }
    };

    $scope.recalculateSpace = function () {
      if ($scope.installation.hardwareRaid.disks && $scope.installation.hardwareRaid.arrays && $scope.installation.hardwareRaid.controller) {
        let diskSize = $scope.installation.hardwareRaid.controller.disks[0].capacity.value;
        const grappe = $scope.installation.hardwareRaid.arrays;
        const nbOfDisks = $scope.installation.hardwareRaid.disks;

        angular.forEach($scope.units.model, (unit) => {
          if (unit.label === $scope.installation.hardwareRaid.controller.disks[0].capacity.unit) {
            diskSize *= unit.value;
          }
        });

        $scope.installation.hardwareRaid.totalSpace = $scope.installation.hardwareRaid.disks * diskSize;
        switch ($scope.installation.hardwareRaid.raid) {
          case TEMPLATE_OS_HARDWARE_RAID_ENUM.raid60:
            $scope.installation.hardwareRaid.availableSpace = (nbOfDisks - (2 * grappe)) * diskSize;
            break;
          case TEMPLATE_OS_HARDWARE_RAID_ENUM.raid50:
            $scope.installation.hardwareRaid.availableSpace = (nbOfDisks - grappe) * diskSize;
            break;
          case TEMPLATE_OS_HARDWARE_RAID_ENUM.raid10:
            $scope.installation.hardwareRaid.availableSpace = grappe * diskSize;
            break;
          case TEMPLATE_OS_HARDWARE_RAID_ENUM.raid6:
            $scope.installation.hardwareRaid.availableSpace = (nbOfDisks - 2) * diskSize;
            break;
          case TEMPLATE_OS_HARDWARE_RAID_ENUM.raid5:
            $scope.installation.hardwareRaid.availableSpace = (nbOfDisks - 1) * diskSize;
            break;
          case TEMPLATE_OS_HARDWARE_RAID_ENUM.raid1:
            $scope.installation.hardwareRaid.availableSpace = diskSize;
            break;
          default:
            $scope.installation.hardwareRaid.availableSpace = $scope.installation.hardwareRaid.totalSpace;
        }
      }
    };

    $scope.invalidHardRaid = function () {
      return $scope.installation.hardwareRaid.disks % $scope.installation.hardwareRaid.arrays !== 0;
    };

    $scope.clearHardwareRaidSpace = function () {
      $scope.installation.hardwareRaid.availableSpace = null;
      $scope.installation.hardwareRaid.totalSpace = null;
    };

    function prepareDiskList() {
      const disksPerArray = $scope.installation.hardwareRaid.disks / $scope.installation.hardwareRaid.arrays;
      if ($scope.installation.hardwareRaid.arrays === 1) {
        return take(
          $scope.installation.hardwareRaid.controller.disks[0].names,
          $scope.installation.hardwareRaid.disks,
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
            $scope.installation.hardwareRaid.controller.disks[0].names,
            $scope.installation.hardwareRaid.disks,
          ),
          disksPerArray,
        ),
        elem => `[${elem.toString()}]`,
      );
    }

    // ------CUSTOME STEP MODAL------
    $scope.reduceModal = function () {
      $scope.setToBigModalDialog(false);
    };
    $scope.extendModal = function () {
      $scope.setToBigModalDialog(true);
    };

    $scope.checkNextStep1 = function () {
      if (!$scope.installation.raidSetup) {
        if ($scope.installation.customInstall) {
          $scope.extendModal();
          $rootScope.$broadcast('wizard-goToStep', 3);
        } else {
          $scope.extendModal();
          $rootScope.$broadcast('wizard-goToStep', 4);
        }
      }
    };

    $scope.checkNextStep2 = function () {
      $scope.extendModal();
      if (!$scope.installation.customInstall) {
        $rootScope.$broadcast('wizard-goToStep', 4);
      }
    };

    $scope.checkPrev1 = function () {
      if (!$scope.installation.raidSetup) {
        $scope.reduceModal();
        $rootScope.$broadcast('wizard-goToStep', 1);
      } else {
        $scope.reduceModal();
      }
    };

    $scope.checkCustomPrevFinal = function () {
      if (!$scope.installation.customInstall) {
        if (!$scope.installation.raidSetup) {
          $scope.reduceModal();
          $rootScope.$broadcast('wizard-goToStep', 1);
        } else {
          $scope.reduceModal();
          $rootScope.$broadcast('wizard-goToStep', 2);
        }
      } else {
        $scope.extendModal();
      }
    };

    $scope.checkIntegrity = function () {
      $scope.errorInst.ws = null;
      $scope.installation.variablePartition = false;
      $scope.installation.options = {
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
      };
      if ($scope.installation.customInstall && $scope.informations.gabaritName) {
        $scope.loader.loading = true;
        Server.checkIntegrity($scope.informations.gabaritName).then(
          () => {
            $scope.loader.loading = false;
          },
          (data) => {
            $scope.loader.loading = false;
            $scope.errorInst.ws = $translate.instant('server_configuration_installation_ovh_step3_error_integrity', { t0: data });
          },
        );
        addRemainingSize();
      } else {
        $scope.loadPartiton();
      }
    };

    // ------INSTALL------
    $scope.validationGabaritName = function () {
      $scope.errorInst.gabaritName = !/^[a-zA-Z0-9_\-]{1,50}$/.test($scope.installation.gabaritNameSave);
    };

    $scope.getMountPoint = function () {
      const list = [];
      angular.forEach($scope.installation.partitionSchemeModels, (partition) => {
        if (partition.fileSystem !== $scope.constants.warningSwap) {
          list.push(partition);
        }
      });
      return list;
    };

    function addRemainingSize() {
      const remainingSize = $scope.getRemainingSize();

      if (
        ($scope.constants.minSizePartition > remainingSize && $scope.installation.selectDistribution.family !== $scope.constants.warningWindows)
                    || ($scope.constants.minSizeWindows > remainingSize && $scope.installation.selectDistribution.family === $scope.constants.warningWindows)
      ) {
        angular.forEach($scope.installation.partitionSchemeModels, (partition) => {
          if (!$scope.installation.options.variablePartition || ($scope.installation.options.variablePartition.partitionSize < partition.partitionSize && $scope.installation.options.variablePartition.partitionSize !== 0)) {
            $scope.installation.options.variablePartition = partition;
            $scope.installation.variablePartition = true;
          }
        });
      }
    }

    $scope.saveRemainingSize = function (_size, stop) {
      let size = _size;

      if (!stop) {
        $scope.errorInst.wsinstall = null;
      }
      if ($scope.installation.customInstall) {
        // if install fail before start
        if (!size) {
          size = 0;
          if ($scope.installation.options.variablePartition) {
            $scope.installation.saveSize = $scope.installation.options.variablePartition.partitionSize;
          }
        }

        // if user has check, change variable partition and uncheck save gabarit
        if (!$scope.installation.options.saveGabarit) {
          addRemainingSize();
        }

        if ($scope.installation.options.variablePartition) {
          $scope.loader.loading = true;
          Server.putSetPartition($scope.informations.gabaritName, $scope.installation.selectPartitionScheme.name, {
            raid: $scope.installation.options.variablePartition.raid,
            fileSystem: $scope.installation.options.variablePartition.fileSystem,
            typePartition: $scope.installation.options.variablePartition.typePartition,
            volumeName: $scope.installation.options.variablePartition.volumeName,
            order: $scope.installation.options.variablePartition.order,
            mountPoint: $scope.installation.options.variablePartition.mountPoint,
            oldMountPoint: $scope.installation.options.variablePartition.mountPoint,
            partitionSize: size,
          }).then(
            () => {
              if (!stop) {
                $scope.install();
              } else {
                $scope.loader.loading = false;
              }
            },
            (data) => {
              $scope.loader.loading = false;
              if (size === 0) {
                $scope.errorInst.wsinstall = $translate.instant('server_configuration_installation_ovh_step3_remaining_error', {
                  t0: $scope.installation.options.variablePartition.mountPoint,
                  t1: data.message,
                });
              } // else it's revert size
            },
          );
        } else if (!stop) {
          $scope.install();
        }
      } else if (!stop) {
        $scope.install();
      }
    };

    $scope.install = function () {
      if ($scope.installation.options.saveGabarit) {
        $scope.loader.loading = true;
        setGabarit();
      } else if ($scope.installation.hardwareRaid.raid) {
        $scope.installation.options.gabaritNameSave = `tmp-mgr-hardwareRaid-${moment().unix()}`;
        setGabarit();
      } else {
        startInstall();
      }
    };

    $scope.canPersonnalizeRaid = function () {
      return $scope.raidIsPersonnalizable() && isDefaultDiskGroup($scope.installation.diskGroup);
    };

    $scope.raidIsPersonnalizable = function () {
      return (
        $scope.constants.server.raidController
                    && get($scope.installation, 'selectDistribution.hardRaidConfiguration') !== false
                    && !$scope.informations.hardwareRaid.error.wrongLocation
                    && !$scope.informations.hardwareRaid.error.notAvailable
      );
    };

    $scope.canEditDiskGroup = function () {
      return $scope.informations.diskGroups.length > 1 && $scope.installation.isHybridCompatible;
    };

    $scope.hasVirtualDesktop = function () {
      return !includes(get($scope.installation, 'selectDistribution.id'), 'hyperv');
    };

    $scope.hasLicencedOs = function () {
      return find($scope.installation.distributionList, distribution => distribution.family === 'WINDOWS');
    };

    function setGabarit() {
      Server.putSetGabarit($stateParams.productId, $scope.informations.gabaritName, $scope.installation.options.gabaritNameSave, {
        changeLog: $scope.installation.options.changeLog,
        customHostname: $scope.installation.options.customHostname,
        postInstallationScriptLink: $scope.installation.options.postInstallationScriptLink,
        postInstallationScriptReturn: $scope.installation.options.postInstallationScriptLink ? $scope.installation.options.postInstallationScriptReturn : null,
        sshKeyName: $scope.installation.options.sshKeyName,
        useDistributionKernel: $scope.installation.options.useDistributionKernel,
      }).then(
        () => {
          $scope.informations.gabaritName = angular.copy($scope.installation.options.gabaritNameSave);
          if ($scope.installation.hardwareRaid.raid) {
            setHardwareRaid();
          } else {
            startInstall();
          }
        },
        (data) => {
          $scope.loader.loading = false;
          $scope.saveRemainingSize($scope.installation.saveSize, true);
          $scope.errorInst.wsinstall = $translate.instant('server_configuration_installation_error_save', { t0: data.data.message });
        },
      );
    }

    function setHardwareRaid() {
      const disks = prepareDiskList();

      Server.postHardwareRaid($stateParams.productId, $scope.informations.gabaritName, $scope.installation.selectPartitionScheme.name, disks, $scope.installation.hardwareRaid.raid)
        .catch((error) => {
          if (error.status === 409) {
            return Server.putHardwareRaid($stateParams.productId, $scope.informations.gabaritName, $scope.installation.selectPartitionScheme.name, disks, $scope.installation.hardwareRaid.raid);
          }
          return $q.reject(error);
        })
        .then(() => {
          startInstall();
        })
        .catch(() => {
          $scope.loader.loading = false;
          $scope.saveRemainingSize($scope.installation.saveSize, true);
          $scope.errorInst.wsinstall = $translate.instant('server_configuration_installation_error_hardwareRaid');
        });
    }

    function startInstall() {
      $scope.loader.loading = true;
      Server.startInstallation($stateParams.productId, $scope.informations.gabaritName, {
        language: camelCase($scope.installation.selectLanguage),
        customHostname: $scope.installation.options.customHostname,
        installSqlServer: $scope.installation.options.installSqlServer,
        postInstallationScriptLink: $scope.installation.options.postInstallationScriptLink,
        postInstallationScriptReturn: $scope.installation.options.postInstallationScriptLink ? $scope.installation.options.postInstallationScriptReturn : null,
        sshKeyName: $scope.installation.options.sshKeyName,
        useDistribKernel: $scope.installation.options.useDistributionKernel,
        useSpla: $scope.installation.options.useSpla,
        softRaidDevices: $scope.informations.nbDisk > 2 && $scope.installation.nbDiskUse > 1 ? $scope.installation.nbDiskUse : null,
        noRaid: $scope.installation.nbDiskUse === 1 && !$scope.informations.raidController,
        diskGroupId: !isDefaultDiskGroup($scope.installation.diskGroup) ? $scope.installation.diskGroup.diskGroupId : null,
        resetHwRaid: !isDefaultDiskGroup($scope.installation.diskGroup),
      }).then(
        (task) => {
          task.id = task.taskId;
          $scope.reduceModal();
          $scope.setMessage(null);
          $rootScope.$broadcast('dedicated.informations.reinstall', task);
          $scope.setAction('installation/progress/dedicated-server-installation-progress', $scope.constants.server);
          $scope.loader.loading = false;
        },
        (data) => {
          $scope.saveRemainingSize($scope.installation.saveSize, true);
          $scope.errorInst.wsinstall = $translate.instant('server_configuration_installation_ovh_step3_error', {
            t0: $scope.installation.selectDistribution.displayName,
            t1: $scope.constants.server.name,
            t2: $scope.installation.selectLanguage,
            t3: data.message,
          });
          $scope.loader.loading = false;
        },
      );
    }

    function isDefaultDiskGroup(diskGroup) {
      return diskGroup && $scope.informations.diskGroups[0].diskGroupId === diskGroup.diskGroupId;
    }

    $scope.$on('dedicated.informations.reinstall.form.update', (e, validForm) => {
      $scope.installation.options.validForm = validForm;
    });
  });
