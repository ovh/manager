import filter from 'lodash/filter';
import find from 'lodash/find';
import flatten from 'lodash/flatten';
import groupBy from 'lodash/groupBy';
import head from 'lodash/head';
import indexOf from 'lodash/indexOf';
import keys from 'lodash/keys';
import last from 'lodash/last';
import pull from 'lodash/pull';
import set from 'lodash/set';
import sortBy from 'lodash/sortBy';
import values from 'lodash/values';

/**
 *  Cloud Volumes list Orchestrator. Heal the world we live in, save it for our children
 *  ====================================================================================
 *
 *  =README=
 *  This orchestrator is used to init and manage a Cloud Volumes list.
 */
angular
  .module('managerApp')
  .service(
    'CloudProjectComputeVolumesOrchestrator',
    function CloudProjectComputeVolumesOrchestratorService(
      $q,
      $translate,
      $rootScope,
      $timeout,
      CLOUD_INSTANCE_DEFAULTS,
      Poller,
      CucUserPref,
      OvhApiCloudProjectVolume,
      OvhApiCloudProjectVolumeSnapshot,
      CloudProjectComputeVolumesFactory,
      OvhApiCloudProjectRegion,
      Toast,
    ) {
      // Warning: all values must be reset at init (see resetDatas())
      const self = this;
      let editedVolume;
      let paramEdition = null;
      // enum NAME, SIZE
      let currentVolumesMovePending;
      const resetDatas = function resetDatas() {
        // The full volumes list to display
        self.volumes = null;

        // Project type (existing, template, template-new)
        self.serviceType = null;

        // Current edited volume
        editedVolume = null;

        // Current moving volumes IDs
        // @todo: to reset when switching project
        currentVolumesMovePending = [];

        // Stop polling if launched
        self.killPollVolumes();
      };

      /**
       *  Get the default volume configuration options for a specified region
       */
      function getDefaultVolumeConfigurationForRegion(defaultRegion) {
        const options = {
          name: $translate.instant('cpci_volume_default_name'),
          region: defaultRegion,
          size: 100,
          type: 'classic',
          bootable: false,
        };
        const optionsQueue = [];

        // @todo: enums toussa

        return $q.allSettled(optionsQueue).then(
          () => {
            if (keys(self.volumes.volumes).length > 0) {
              // use the most recent volume parameters
              const mostRecentVolume = last(
                sortBy(flatten(values(self.volumes.volumes)), 'creationDate'),
              );
              if (mostRecentVolume) {
                options.region = mostRecentVolume.region;
                options.size = mostRecentVolume.size;
                options.type = mostRecentVolume.type;
              }
            }
            return options;
          },
          () => options,
        );
      }

      /**
       *  Get the default volume configuration options
       */
      const getDefaultVolumeConfiguration = function getDefaultVolumeConfiguration() {
        return OvhApiCloudProjectRegion.v6()
          .query({
            serviceName: self.volumes.serviceName,
          })
          .$promise.then((regionList) => {
            // check if the default region exists
            let { region } = CLOUD_INSTANCE_DEFAULTS;
            if (indexOf(regionList, region) === -1) {
              region = head(regionList);
            }
            return getDefaultVolumeConfigurationForRegion(region);
          });
      };

      /**
       *  Add a volume into project Volumes list
       */
      this.addNewVolumeToList = function addNewVolumeToList(targetId) {
        let volume;
        return $q
          .when(true)
          .then(() => getDefaultVolumeConfiguration())
          .then((options) => {
            volume = self.volumes.addVolumeToList(options, targetId);
            volume.status = 'DRAFT';
            self.saveToUserPref();
            return volume;
          });
      };

      /**
       * Add a volume from a given snapshot into project Volumes list
       */
      this.addNewVolumeFromSnapshotToList = function addNewVolumeFromSnapshotToList(
        targetId,
        snapshot,
      ) {
        // eslint-disable-next-line no-shadow
        const getVolumeFromSnapshot = function(snapshot) {
          if (!snapshot || !snapshot.id) {
            return $q.reject({
              data: { message: 'Snapshot id cannot be found' },
            });
          }
          return OvhApiCloudProjectVolume.v6().get({
            serviceName: self.volumes.serviceName,
            volumeId: snapshot.volumeId,
          }).$promise;
        };

        /**
         * Since snapshot doesnt contains the volume type we need to fetch the volume.
         * If the volume has been deleted the api still has a backup of it so it's not a problem.
         */
        return getVolumeFromSnapshot(snapshot).then((toRestore) => {
          if (!toRestore || !toRestore.type) {
            return $q.reject({
              data: { message: 'Volume to restore cannot be found' },
            });
          }
          const options = {
            name: snapshot.name || toRestore.name,
            region: snapshot.region || toRestore.region,
            size: snapshot.minDisk || toRestore.size,
            type: toRestore.type,
            bootable: toRestore.bootable,
            snapshot,
          };
          const volume = self.volumes.addVolumeToList(options, targetId);
          volume.status = 'DRAFT';
          self.saveToUserPref();
          return $q.when(volume);
        });
      };

      /**
       *  Launch the volume creation.
       */
      this.saveNewVolume = function saveNewVolume(volume) {
        return volume.create().then(() => {
          self.saveToUserPref();
          self.pollVolumes(); // WARNING: Never return promise because pulling had to live on her side
        });
      };

      /**
       *  Set the volume that is currently in edition
       */
      this.turnOnVolumeEdition = function turnOnVolumeEdition(volume) {
        editedVolume = volume;
        editedVolume.startEdition();
      };

      /**
       *  Close/Reset the volume that is currently in edition
       */
      this.turnOffVolumeEdition = function turnOffVolumeEdition(reset) {
        editedVolume.stopEdition(!!reset);
        delete editedVolume.snapshot; // in case of snapshot restore, we delete snapshot reference
        editedVolume = null;
      };

      /**
       *  Get the volume that is currently in edition
       */
      this.getEditedVolume = function getEditedVolume() {
        return editedVolume;
      };

      /**
       *  Get parameters for current edition
       */
      this.getEditVolumeParam = function getEditVolumeParam() {
        return paramEdition;
      };

      /**
       *  Get parameters for current edition
       */
      this.setEditVolumeParam = function setEditVolumeParam(param) {
        paramEdition = param;
      };

      /**
       *  Save the volume modifications
       */
      this.saveEditedVolume = function saveEditedVolume(volume) {
        return volume.edit().then(() => {
          self.saveToUserPref();
          self.pollVolumes(); // WARNING: Never return promise because pulling had to live on her side
        });
      };

      /**
       *  Delete volume
       */
      this.deleteVolume = function deleteVolume(volumeOrVolumeId) {
        const volume =
          typeof volumeOrVolumeId === 'string' ||
          typeof volumeOrVolumeId === 'number'
            ? self.volumes.getVolumeById(volumeOrVolumeId)
            : null;

        if (!volume) {
          return $q.reject({ data: { message: 'Volume id cannot be find' } });
        }

        if (volume.status === 'DRAFT') {
          return $q.when(true).then(() => {
            self.volumes.removeVolumeFromList(volume);
            self.saveToUserPref();
          });
        }
        return volume.remove().then(() => {
          self.saveToUserPref();
          self.pollVolumes(); // WARNING: Never return promise because pulling had to live on her side
        });
      };

      /**
       *  Move a volume.
       *  If targetId: move it to a vm, if not: move it to "parking"
       */
      this.moveVolume = function moveVolume(volumeOrVolumeId, targetId) {
        const volume =
          typeof volumeOrVolumeId === 'string' ||
          typeof volumeOrVolumeId === 'number'
            ? self.volumes.getVolumeById(volumeOrVolumeId)
            : null;
        // eslint-disable-next-line no-param-reassign
        targetId = targetId || 'unlinked';

        if (!volume) {
          return $q.reject({ data: { message: 'Volume id cannot be find' } });
        }

        const sourceId =
          volume.attachedTo && volume.attachedTo.length
            ? volume.attachedTo[0]
            : 'unlinked';
        const action =
          !targetId || targetId === 'unlinked' ? 'detach' : 'attach';

        if (volume.status === 'DRAFT') {
          // @todo
          return $q.when('TODO').then(() => {
            self.saveToUserPref();
          });
        }
        // We need to hide it from previous location,
        // and show it into its new location BEFORE the end of the task...
        // To do that, we move it, and we put a special status.
        self.volumes.removeVolumeFromList(volume, sourceId);
        self.volumes.addVolumeToList(volume, targetId);
        currentVolumesMovePending.push(volume.id);

        volume.status = `${action}ing`;
        return volume[action](action === 'detach' ? sourceId : targetId).then(
          () => {
            self.pollVolumes(); // WARNING: Never return promise because pulling had to live on her side
          },
          (err) => {
            // revert
            self.volumes.addVolumeToList(volume, sourceId);
            self.volumes.removeVolumeFromList(volume, targetId);
            pull(currentVolumesMovePending, volume.id);
            return $q.reject(err);
          },
        );
      };

      /**
       * Create a snapshot of given volume.
       */
      this.snapshotVolume = function snapshotVolume(volume, snapshotName) {
        return OvhApiCloudProjectVolumeSnapshot.v6()
          .create(
            {
              serviceName: self.volumes.serviceName,
              volumeId: volume.id,
            },
            {
              name: snapshotName,
            },
          )
          .$promise.then(
            () => {
              set(volume, 'status', 'snapshotting');
              self.pollVolumes();
            },
            (err) => $q.reject(err),
          );
      };

      /* -----  End of VOLUMES  ------*/

      /*= ==============================
    =            POLLING            =
    =============================== */

      /**
       *  --- [Volumes] --- [update] ---
       *
       * Updates volumes from API with volumes from this factory
       *  /!\ This don't add or remove volumes!
       */
      function updateVolumesWithVolumesFromApi(
        volumesFromApi,
        updateOnlySpecificDatas,
      ) {
        let haveChanges = false;

        angular.forEach(
          self.volumes.volumes,
          (volumesFromFactory, targetId) => {
            if (
              !volumesFromApi[targetId] ||
              !volumesFromFactory ||
              !volumesFromFactory.length
            ) {
              return;
            }

            angular.forEach(volumesFromFactory, (volumeFromFactory) => {
              const volumeFromApi = find(volumesFromApi[targetId], {
                id: volumeFromFactory.id,
              });

              if (!volumeFromApi) {
                return;
              }

              // If the volume was in pending move, and now active, remove it from pendingArray.
              if (
                ~currentVolumesMovePending.indexOf(volumeFromFactory.id) &&
                ~['available', 'in-use'].indexOf(volumeFromApi.status)
              ) {
                pull(currentVolumesMovePending, volumeFromFactory.id);
              }

              // If the volume was in snapshotting, and now active display success message
              if (
                volumeFromFactory.status === 'snapshotting' &&
                ~['available', 'in-use'].indexOf(volumeFromApi.status)
              ) {
                Toast.success(
                  $translate.instant('cpci_volume_snapshotting_end', {
                    volume: volumeFromFactory.name,
                  }),
                );
              }

              if (updateOnlySpecificDatas) {
                // Update status
                if (volumeFromFactory.status !== volumeFromApi.status) {
                  haveChanges = true;
                  set(volumeFromFactory, 'status', volumeFromApi.status);
                }
              } else {
                // Updates all infos
                volumeFromFactory.setInfos(volumeFromApi);
                haveChanges = true;
              }
            });
          },
        );

        return haveChanges;
      }

      /**
       *  --- [Volumes] --- [addOrDelete] ---
       *
       *  Add or remove volumes from API with volumes from this factory
       *  /!\ This can't update existing datas!!!
       */
      function addOrDeleteVolumesWithVolumesFromApi(
        volumesFromApi,
        forceRemoveDrafts,
      ) {
        let haveChanges = false;

        /*= =========  Remove deleted volumes  ========== */

        angular.forEach(
          self.volumes.volumes,
          (volumesFromFactory, targetId) => {
            const deletedVolumes = filter(volumesFromFactory, (vol) => {
              // don't remove drafts!
              if (!forceRemoveDrafts && vol.status === 'DRAFT') {
                return false;
              }
              return (
                !volumesFromApi[targetId] ||
                !find(volumesFromApi[targetId], { id: vol.id })
              );
            });

            angular.forEach(deletedVolumes, (vol) => {
              // Don't remove pending move
              if (~currentVolumesMovePending.indexOf(vol.id)) {
                return;
              }
              self.volumes.removeVolumeFromList(vol, targetId);
            });

            haveChanges = haveChanges || !!deletedVolumes.length;
          },
        );

        /*= =========  Add new volumes  ========== */

        // eslint-disable-next-line no-shadow
        angular.forEach(volumesFromApi, (volumesFromApi, targetId) => {
          let addedVolumes;

          if (
            !self.volumes.volumes[targetId] ||
            !self.volumes.volumes[targetId].length
          ) {
            addedVolumes = volumesFromApi;
          } else {
            addedVolumes = filter(
              volumesFromApi,
              (vol) => !find(self.volumes.volumes[targetId], { id: vol.id }),
            );
          }

          angular.forEach(addedVolumes, (vol) => {
            // Don't add pending move
            if (~currentVolumesMovePending.indexOf(vol.id)) {
              return;
            }
            self.volumes.addVolumeToList(vol, targetId);
          });

          haveChanges = haveChanges || !!addedVolumes.length;
        });

        if (haveChanges) {
          $rootScope.$broadcast('infra.refresh.links');
        }

        return haveChanges;
      }

      /**
       *  Triggered by polling: Update volumes list
       *
       *  /!\ take care to don't update all datas, user can be in edition for example.
       */
      function updateVolumesFromPolling(volumesParam) {
        let volumes = volumesParam;
        let haveChanges = false;

        // Group by attachedTo
        volumes = groupBy(volumes, (vol) =>
          vol.attachedTo && vol.attachedTo.length
            ? vol.attachedTo[0]
            : 'unlinked',
        );

        // Update existing Volumes
        haveChanges =
          updateVolumesWithVolumesFromApi(volumes, true) || haveChanges;
        // Add new Volumes, and delete removed Volumes
        haveChanges =
          addOrDeleteVolumesWithVolumesFromApi(volumes) || haveChanges;

        if (haveChanges) {
          self.saveToUserPref();
        }

        return $q.when(volumes);
      }

      /**
       *  --- [Volumes] --- POLLING ---
       *
       *  Poll Volumes query
       */
      this.pollVolumes = function pollVolumes() {
        const continueStatus = [
          'creating',
          'attaching',
          'deleting',
          'extending',
          'detaching',
          'snapshotting',
        ];

        Poller.poll(`/cloud/project/${self.volumes.serviceName}/volume`, null, {
          successRule(volume) {
            return !~continueStatus.indexOf(volume.status);
          },
          namespace: 'cloud.volumes',
          notifyOnError: false,
        }).then(
          (volumes) => {
            updateVolumesFromPolling(volumes);
          },
          (err) => {
            if (err && err.status) {
              // eslint-disable-next-line no-console
              console.warn('pollVolumes', err);
              // @todo add bugkiller here
            }
          },
          (volumes) => {
            updateVolumesFromPolling(volumes);
          },
        );
      };

      /**
       *  --- [Volumes] --- POLLING KILL ---
       *
       *  Kill the Poll Volumes query
       */
      this.killPollVolumes = function killPollVolumes() {
        Poller.kill({ namespace: 'cloud.volumes' });
      };

      /* -----  End of Polling  ------*/

      /*= ===================================
        =            userPref                =
        ==================================== */

      this.saveToUserPref = function saveToUserPref() {
        return CucUserPref.set(
          `cloud_project_${self.volumes.serviceName}_volumes`,
          self.volumes.prepareToJson(),
        );
      };

      this.createFromUserPref = function createFromUserPref(serviceName) {
        const key = `cloud_project_${serviceName}_volumes`;
        return CucUserPref.get(key).then(
          (volumes) => {
            set(volumes, 'serviceName', serviceName);
            return new CloudProjectComputeVolumesFactory(volumes);
          },
          () =>
            new CloudProjectComputeVolumesFactory({
              serviceName,
            }),
        );
      };

      /*= ===================================================
    =            LOCAL DATAS UPGRADE (by API)            =
    ======================================================
    * =README=
    * Add, upgrade, and delete VMs or IPs lists with datas from APIs.
    * Used at initialization, and with polling.
    **************************************************** */

      /* -----  End of LOCAL DATAS UPGRADE  ------*/

      /*= =====================================
        =            INITIALISATION            =
        ====================================== */

      /**
       * Initialize a volumes list, from existing project.
       */
      function initExistingProject(opts) {
        return self
          .createFromUserPref(opts.serviceName)
          .then((volumesFromCache) => {
            const initQueue = [];

            self.volumes = volumesFromCache;

            /*= =========  Volumes  ========== */

            initQueue.push(
              OvhApiCloudProjectVolume.v6()
                .query({
                  serviceName: self.volumes.serviceName,
                })
                .$promise.then((volumesParam) => {
                  let volumes = volumesParam;

                  // Group by attachedTo
                  volumes = groupBy(volumes, (vol) =>
                    vol.attachedTo && vol.attachedTo.length
                      ? vol.attachedTo[0]
                      : 'unlinked',
                  );

                  // Merge with local datas
                  updateVolumesWithVolumesFromApi(volumes);
                  addOrDeleteVolumesWithVolumesFromApi(volumes, true);
                }),
            );

            return $q.all(initQueue).then(() => {
              // WARNING: Never return promise because pulling had to live on her side
              self.pollVolumes();
              return self.volumes;
            });
          });
      }

      /**
       *  Initialize a new Volumes list, depending of the project's type.
       */
      this.init = function init(opts) {
        resetDatas();
        return initExistingProject(opts);
      };
    },
  );
