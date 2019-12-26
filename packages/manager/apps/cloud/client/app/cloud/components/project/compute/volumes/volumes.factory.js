import find from 'lodash/find';
import map from 'lodash/map';
import remove from 'lodash/remove';
import set from 'lodash/set';

angular
  .module('managerApp')
  .factory(
    'CloudProjectComputeVolumesFactory',
    (CloudProjectComputeVolumesVolumeFactory) => {
      /**
       *  Defines a cloud project compute infrastructure
       *
       *  @param    {Object}  optionsParam
       *                      Options for creating a new CloudProjectInfrastructure
       *  @param    {Object}  optionsParam.volumes
       *                      List of Volumes with its options
       */
      const VolumesFactory = (function VolumesFactory() {
        return function CloudProjectComputeVolumesFactory(optionsParam) {
          let options = optionsParam;
          const self = this;

          if (!options) {
            options = {};
          }

          this.serviceName = options.serviceName || null;

          this.volumes = {};

          if (options.volumes && options.volumes.length) {
            angular.forEach(options.volumes, (volume, targetId) => {
              self.addVolumeToList(volume, targetId);
            });
          }
        };
      })();

      // /////////////////////////////
      // /         METHODS          //
      // /////////////////////////////

      /**
       *  Check if item is already an instance or an options object
       */
      function checkVolume(volume) {
        return volume instanceof CloudProjectComputeVolumesVolumeFactory
          ? volume
          : new CloudProjectComputeVolumesVolumeFactory(volume);
      }

      /**
       *  Get volume by volume ID.
       */
      VolumesFactory.prototype.getVolumeById = function getVolumeById(
        volumeId,
      ) {
        let vol;
        angular.forEach(this.volumes, (volume) => {
          if (!vol) {
            vol = find(volume, { id: volumeId });
          }
        });
        return vol;
      };

      /**
       *  Add a volume into list
       */
      VolumesFactory.prototype.addVolumeToList = function addVolumeToList(
        volume,
        targetIdParam,
      ) {
        let targetId = targetIdParam;

        targetId = targetId || 'unlinked';

        set(volume, 'serviceName', this.serviceName); // Add projectId to item

        // eslint-disable-next-line no-param-reassign
        volume = checkVolume(volume);
        volume.setInfos({
          attachedTo: [targetId],
        });

        if (!this.volumes[targetId]) {
          this.volumes[targetId] = [];
        }

        this.volumes[targetId].push(volume);
        return volume;
      };

      /**
       *  Remove given volume from list
       */
      VolumesFactory.prototype.removeVolumeFromList = function removeVolumeFromList(
        volume,
        targetIdParam,
      ) {
        let targetId = targetIdParam;
        targetId = targetId || 'unlinked';
        remove(this.volumes[targetId], { id: volume.id });
        return volume;
      };

      // ---

      /**
       *  Prepare object to json encode function to avoid function being encoded
       */
      VolumesFactory.prototype.prepareToJson = function prepareToJson() {
        const preparedToJson = {};
        angular.forEach(this.volumes, (volumes, targetId) => {
          preparedToJson[targetId] = map(volumes, (volume) =>
            volume.prepareToJson(),
          );
        });
        return {
          volumes: preparedToJson,
        };
      };

      return VolumesFactory;
    },
  );
