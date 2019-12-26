import flatten from 'lodash/flatten';

angular
  .module('managerApp')
  .factory(
    'CloudProjectComputeVolumesVolumeFactory',
    ($q, CucPriceHelper, OvhApiCloudProjectVolume) => {
      /**
       *  Defines a cloud project compute volume
       *
       *  /!\ Take care when modifying this!!! Check setInfos, and prepareToJson too.
       */
      const VolumeFactory = (function VolumeFactory() {
        return function CloudProjectComputeVolumesVolumeFactory(optionsParam) {
          let options = optionsParam;

          if (!options) {
            options = {};
          }

          // Set custom values
          options = this.getCustomOptions(options);

          // Extend and set default values
          angular.extend(
            this,
            angular.extend(
              {
                id: Math.floor(Math.random() * 1000 * new Date().getTime()),
                status: '',
                createdAt: new Date().toISOString(),
              },
              options,
            ),
          );

          // Updating price
          this.getFullInformations();
        };
      })();

      // /////////////////////
      //      METHODS      //
      // /////////////////////

      /**
       *  Set customs options (for init, and updates)
       *  -> @devs: put your customs values here
       */
      VolumeFactory.prototype.getCustomOptions = function getCustomOptions(
        options,
      ) {
        return angular.extend(options, {
          attachedTo: options.attachedTo ? flatten([options.attachedTo]) : [], // Ensure attachedTo is always an array
        });
      };

      /**
       *  Set infos after initialization
       */
      VolumeFactory.prototype.setInfos = function setInfos(optionsParam) {
        let options = optionsParam;

        // Set custom values
        options = this.getCustomOptions(options || {});

        // Ok now extend it
        angular.extend(this, options);

        // Updating price
        return this.getFullInformations();
      };

      /**
       *  [API] Get the item from API using its id
       */
      VolumeFactory.prototype.get = function get() {
        const self = this;

        return OvhApiCloudProjectVolume.v6()
          .get({
            serviceName: this.serviceName,
            volumeId: this.id,
          })
          .$promise.then((volOptions) => self.setInfos(volOptions));
      };

      /**
       *  [API] Get additional informations about volume (price)
       *  Create a volumePricesMap attribute like { 'planCode' : { 'price' : {} } }
       */
      VolumeFactory.prototype.getFullInformations = function getFullInformations() {
        const self = this;
        return CucPriceHelper.getPrices(this.serviceName).then((response) => {
          self.volumePricesMap = response;
        });
      };

      /**
       *  Calculate price with GB price and volume size
       */
      VolumeFactory.prototype.calculatePrice = function calculatePrice() {
        return this.getPrice(this.region, this.type, this.size);
      };

      VolumeFactory.prototype.getPrice = function getPrice(
        region,
        type,
        size = 1,
      ) {
        // in case if getFullInformations is not resolved yet
        if (this.volumePricesMap) {
          const volumeByRegionAndTypePrice =
            this.volumePricesMap[this.planCode] ||
            this.volumePricesMap[`volume.${type}.consumption.${region}`] ||
            this.volumePricesMap[`volume.${type}.consumption`];
          if (volumeByRegionAndTypePrice) {
            const calculatedPriceValue =
              (size * volumeByRegionAndTypePrice.priceInUcents) / 100000000;
            const calculatedMonthlyPriceValue =
              calculatedPriceValue * moment.duration(1, 'months').asHours();
            return {
              price: {
                currencyCode: volumeByRegionAndTypePrice.price.currencyCode,
                text: volumeByRegionAndTypePrice.price.text.replace(
                  /\d+(?:[.,]\d+)?/,
                  `${calculatedPriceValue.toFixed(2)}`,
                ),
                value: calculatedPriceValue,
              },
              monthlyPrice: {
                currencyCode: volumeByRegionAndTypePrice.price.currencyCode,
                text: volumeByRegionAndTypePrice.price.text.replace(
                  /\d+(?:[.,]\d+)?/,
                  `${calculatedMonthlyPriceValue.toFixed(2)}`,
                ),
                value: calculatedMonthlyPriceValue,
              },
            };
          }
        }

        return {
          price: {},
          monthlyPrice: {},
        };
      };

      /**
       *   Get type of status.
       */
      VolumeFactory.prototype.getStatusGroup = function getStatusGroup() {
        if (~['available', 'in-use'].indexOf(this.status)) {
          return 'ACTIVE';
        }
        if (
          ~[
            'creating',
            'attaching',
            'detaching',
            'deleting',
            'backing-up',
            'restoring-backup',
            'snapshotting',
          ].indexOf(this.status)
        ) {
          return 'PENDING';
        }
        if (
          ~[
            'error',
            'error_deleting',
            'error_restoring',
            'error_extending',
          ].indexOf(this.status)
        ) {
          return 'ERROR';
        }
        return this.status;
      };

      /**
       *  [API] Create new volume. POST informations for creating a volume to API
       */
      VolumeFactory.prototype.create = function create() {
        const self = this;

        return OvhApiCloudProjectVolume.v6()
          .save(
            {
              serviceName: this.serviceName,
            },
            {
              description: this.description || undefined,
              name: this.name || undefined,
              region: this.region,
              size: parseInt(this.size, 10),
              type: this.type,
              bootable: this.bootable,
              snapshotId: this.snapshot ? this.snapshot.id : undefined,
            },
          )
          .$promise.then((volOptions) => {
            self.id = volOptions.id; // we must do it because old id is a fake one
            self.status = volOptions.status;
            return self;
          });
      };

      /**
       *  [API] Delete a volume.
       */
      VolumeFactory.prototype.remove = function remove() {
        const self = this;

        return OvhApiCloudProjectVolume.v6()
          .remove({
            serviceName: this.serviceName,
            volumeId: this.id,
          })
          .$promise.then(() => {
            self.status = 'deleting';
            return self;
          });
      };

      /**
       *  [API] Edit the volume
       */
      VolumeFactory.prototype.edit = function edit() {
        const self = this;

        const promises = [];

        if (
          self.hasChange('name') ||
          self.hasChange('description') ||
          self.hasChange('bootable')
        ) {
          promises.push(
            OvhApiCloudProjectVolume.v6()
              .put(
                {
                  serviceName: self.serviceName,
                  volumeId: self.id,
                },
                {
                  description: self.description || undefined,
                  name: self.name || undefined,
                  bootable: self.bootable,
                },
              )
              .$promise.then(
                () => self,
                (error) =>
                  $q.reject({
                    error: error.data,
                    requestName: 'put',
                  }),
              ),
          );
        }

        // upscale
        if (self.hasChange('size')) {
          promises.push(
            OvhApiCloudProjectVolume.v6()
              .upsize(
                {
                  serviceName: self.serviceName,
                  volumeId: self.id,
                },
                {
                  size: parseInt(self.size, 10),
                },
              )
              .$promise.then(
                () => self,
                (error) =>
                  $q.reject({
                    error: error.data,
                    requestName: 'upsize',
                  }),
              ),
          );
        }

        return $q.allSettled(promises).catch((responses) => {
          const tabError = responses.filter((val) => !!val.error);
          return $q.reject({
            errors: tabError,
            vm: self,
          });
        });
      };

      /**
       *  Enable the edition mode.
       */
      VolumeFactory.prototype.startEdition = function startEdition() {
        const self = this;
        // Edit
        if (self.getStatusGroup() === 'ACTIVE') {
          self.saveForEdition = {
            name: angular.copy(self.name),
            description: angular.copy(self.description),
            size: angular.copy(self.size),
            bootable: angular.copy(self.bootable),
          };
        }
        self.openDetail = true;
      };

      /**
       *  Disable the edition mode.
       */
      VolumeFactory.prototype.stopEdition = function stopEdition(cancel) {
        const self = this;
        // Edit
        if (self.saveForEdition && cancel) {
          self.name = angular.copy(self.saveForEdition.name);
          self.description = angular.copy(self.saveForEdition.description);
          self.size = angular.copy(self.saveForEdition.size);
          self.bootable = angular.copy(self.saveForEdition.bootable);
        }
        self.saveForEdition = false;
        self.openDetail = false;
      };

      /**
       * [EDIT] Item has changes ?
       */
      VolumeFactory.prototype.hasChange = function hasChange(targetSection) {
        const self = this;

        if (!self.saveForEdition) {
          return null;
        }

        if (targetSection) {
          switch (targetSection) {
            case 'name':
              return self.name !== self.saveForEdition.name;
            case 'description':
              return self.description !== self.saveForEdition.description;
            case 'size':
              return self.size !== self.saveForEdition.size;
            case 'bootable':
              return self.bootable !== self.saveForEdition.bootable;
            default:
              return null;
          }
        } else {
          return (
            self.hasChange('name') ||
            self.hasChange('description') ||
            self.hasChange('size') ||
            self.hasChange('bootable')
          );
        }
      };

      /**
       * Attach a volume to a vm
       */
      VolumeFactory.prototype.attach = function attach(vmId) {
        const self = this;
        return OvhApiCloudProjectVolume.v6()
          .attach(
            {
              serviceName: this.serviceName,
              volumeId: this.id,
            },
            {
              instanceId: vmId,
            },
          )
          .$promise.then((volOptions) => {
            self.status = volOptions.status;
          });
      };

      /**
       * Detach a volume from a vm
       */
      VolumeFactory.prototype.detach = function detach(vmId) {
        const self = this;
        return OvhApiCloudProjectVolume.v6()
          .detach(
            {
              serviceName: this.serviceName,
              volumeId: this.id,
            },
            {
              instanceId: vmId,
            },
          )
          .$promise.then((volOptions) => {
            self.status = volOptions.status;
          });
      };

      /*= =========  ---  ========== */

      /**
       *  Prepare a vm to be JSON stringified by returning only attributes.
       */
      VolumeFactory.prototype.prepareToJson = function prepareToJson() {
        if (this.status === 'DRAFT') {
          return {
            id: this.id,
            status: this.status,
            name: this.name,
            description: this.description || null,
            size: this.size || null,
            type: this.type || null,
            region: this.region || null,
            bootable: this.bootable || false,
            attachedTo: this.attachedTo || [],
          };
        }
        return {
          id: this.id,
          status: this.status,
        };
      };

      return VolumeFactory;
    },
  );
