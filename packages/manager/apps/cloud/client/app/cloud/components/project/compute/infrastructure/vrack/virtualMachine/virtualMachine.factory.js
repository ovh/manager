import find from 'lodash/find';
import flatten from 'lodash/flatten';
import get from 'lodash/get';
import head from 'lodash/head';
import isEmpty from 'lodash/isEmpty';
import last from 'lodash/last';
import maxBy from 'lodash/maxBy';
import set from 'lodash/set';

angular
  .module('managerApp')
  .factory(
    'CloudProjectComputeInfraVrackVmFactory',
    (
      $rootScope,
      $q,
      CucPriceHelper,
      OvhApiCloudProjectInstance,
      OvhApiCloudProjectFlavor,
      OvhApiCloudProjectImage,
      OvhApiCloudProjectSnapshot,
      OvhApiCloudProjectSshKey,
      CLOUD_VM_STATE,
      CLOUD_MONITORING,
    ) => {
      /**
       *  Defines a cloud project compute infrastructure vm
       *
       *  /!\ Take care when modifying this!!! Check setInfos, and prepareToJson too.
       */
      const VirtualMachineFactory = (function VirtualMachineFactory() {
        return function CloudProjectComputeInfraVrackVmFactory(optionsParam) {
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
                created: new Date().toISOString(),
                collapsed: false,
              },
              options,
            ),
          );

          // Updating flavorId, imageId, or sshKeyId, ...
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
      VirtualMachineFactory.prototype.getCustomOptions = function getCustomOptions(
        options,
      ) {
        return angular.extend(options, {
          routedTo: options.routedTo ? flatten([options.routedTo]) : [], // Ensure routedTo is always an array
          monthlyBillingBoolean: !!options.monthlyBilling, // Set monthlyBillingBoolean
        });
      };

      /**
       *  Set infos after initialization
       */
      VirtualMachineFactory.prototype.setInfos = function setInfos(
        optionsParam,
      ) {
        let options = optionsParam;

        // Set custom values
        options = this.getCustomOptions(options || {});

        // Ok now extend it
        angular.extend(this, options);

        // Updating flavorId, imageId, or sshKeyId, ...
        return this.getFullInformations();
      };

      /**
       *  [API] Get the virtual machine from API using its id
       */
      VirtualMachineFactory.prototype.get = function getFn() {
        const self = this;

        return OvhApiCloudProjectInstance.v6()
          .get({
            serviceName: this.serviceName,
            instanceId: this.id,
          })
          .$promise.then((vmOptions) => self.setInfos(vmOptions));
      };

      /**
       *  [API] Get additional informations
       */
      VirtualMachineFactory.prototype.updatePrice = function updatePrice() {
        const self = this;
        return CucPriceHelper.getPrices(self.serviceName).then((prices) => {
          self.price = prices[self.planCode];
          // Set 3 digits for hourly price
          if (!self.monthlyBillingBoolean) {
            self.price.price.text = self.price.price.text.replace(
              /\d+(?:[.,]\d+)?/,
              `${self.price.price.value.toFixed(3)}`,
            );
          }
        });
      };

      VirtualMachineFactory.prototype.getFullInformations = function getFullInformations() {
        const queue = [];
        const self = this;

        // image
        const image = this.imageId || (this.image && this.image.id);
        if (image) {
          queue.push(
            OvhApiCloudProjectImage.v6()
              .query({
                serviceName: this.serviceName,
              })
              .$promise.then((images) => {
                self.image = find(images, { id: image });

                // so it's a snapshot
                if (!self.image) {
                  return OvhApiCloudProjectSnapshot.v6()
                    .query({
                      serviceName: self.serviceName,
                    })
                    .$promise.then((snapshots) => {
                      self.image = find(snapshots, { id: image });

                      // so maybe image is not in list
                      if (!self.image) {
                        return OvhApiCloudProjectImage.v6()
                          .get({
                            serviceName: self.serviceName,
                            imageId: image,
                          })
                          .$promise.then((img) => {
                            self.image = img;
                          });
                      }
                      return self;
                    });
                }
                return self;
              }),
          );
        }

        // flavor + price
        const flavorId = this.flavorId || (this.flavor && this.flavor.id);
        if (flavorId) {
          queue.push(
            OvhApiCloudProjectFlavor.v6()
              .query({
                serviceName: this.serviceName,
              })
              .$promise.then((flavorsList) => {
                self.flavor = find(flavorsList, { id: flavorId });
                self.planCode =
                  self.flavor.planCodes[
                    self.monthlyBillingBoolean ? 'monthly' : 'hourly'
                  ];

                // if not in the list: it's a deprecated flavor: directly get it!
                if (!self.flavor) {
                  return OvhApiCloudProjectFlavor.v6()
                    .get({
                      serviceName: self.serviceName,
                      flavorId,
                    })
                    .$promise.then((flavorDeprecated) => {
                      set(flavorDeprecated, 'deprecated', true);
                      self.flavor = flavorDeprecated;
                    });
                }
                return self;
              }),
          );
        }

        // if sshKeyId
        if (this.sshKeyId) {
          queue.push(
            OvhApiCloudProjectSshKey.v6()
              .query({
                serviceName: this.serviceName,
              })
              .$promise.then((sshKeys) => {
                self.sshKey = find(sshKeys, { id: self.sshKeyId });
              }),
          );
        }

        return $q.all(queue).then(() => self.updatePrice());
      };

      /**
       *   Get type of status.
       */
      VirtualMachineFactory.prototype.getStatusGroup = function getStatusGroup() {
        if (~CLOUD_VM_STATE.pending.indexOf(this.status)) {
          return 'PENDING';
        }
        if (~CLOUD_VM_STATE.openstack.indexOf(this.status)) {
          return 'OPENSTACK';
        }
        if (~CLOUD_VM_STATE.error.indexOf(this.status)) {
          return 'ERROR';
        }
        return this.status;
      };

      /**
       *  Get ip flagged with private type
       */
      VirtualMachineFactory.prototype.getPrivateIp = function getPrivateIp() {
        return find(this.ipAddresses, (ip) => ip.type === 'private');
      };

      VirtualMachineFactory.prototype.getPublicIpv4 = function getPublicIpv4() {
        return get(
          find(
            this.ipAddresses,
            (ip) => ip.type === 'public' && ip.version === 4,
          ),
          'ip',
          '',
        );
      };

      VirtualMachineFactory.prototype.getPublicIpv6 = function getPublicIpv6() {
        return get(
          find(
            this.ipAddresses,
            (ip) => ip.type === 'public' && ip.version === 6,
          ),
          'ip',
          get(this.ipAddresses[0], 'ipV6.ip', ''),
        );
      };

      /**
       *  [API] Launch the virtual machine. POST informations for creating an instance to API
       */
      VirtualMachineFactory.prototype.launchCreation = function launchCreation() {
        const self = this;

        return OvhApiCloudProjectInstance.v6()
          .save(
            {
              serviceName: this.serviceName,
            },
            {
              flavorId: this.flavor.id,
              imageId: this.image.id,
              name: this.name,
              region: this.region,
              sshKeyId: this.sshKey ? this.sshKey.id : undefined,
              monthlyBilling: this.monthlyBillingBoolean,
              userData: this.userData,
              networks: this.networks,
            },
          )
          .$promise.then((vmOptions) => {
            self.id = vmOptions.id; // WARNING: don't forget tu replaceItem with orderedHash!
            self.status = vmOptions.status;
            self.planCode = vmOptions.planCode;
            return self.updatePrice();
          })
          .finally(() => self);
      };

      /**
       *  [API] Delete a virtual machine.
       */
      VirtualMachineFactory.prototype.remove = function remove() {
        const self = this;
        const oldStatus = self.status;

        return OvhApiCloudProjectInstance.v6()
          .remove({
            serviceName: this.serviceName,
            instanceId: this.id,
          })
          .$promise.then(() => {
            self.status = 'DELETING';
            $rootScope.$broadcast(
              'compute.infrastructure.vm.status-update',
              self.status,
              oldStatus,
              self,
            );

            return self;
          });
      };

      /**
       *  [API] Edit the VM (name)
       */
      VirtualMachineFactory.prototype.edit = function edit() {
        const self = this;
        const promises = [];

        if (self.hasChange('name')) {
          promises.push(
            OvhApiCloudProjectInstance.v6()
              .put(
                {
                  serviceName: self.serviceName,
                  instanceId: self.id,
                },
                {
                  instanceName: self.name,
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

        if (self.hasChange('monthlyBilling')) {
          promises.push(
            OvhApiCloudProjectInstance.v6()
              .activeMonthlyBilling(
                {
                  serviceName: self.serviceName,
                  instanceId: self.id,
                },
                {},
              )
              .$promise.then(
                (vmOptions) => {
                  self.monthlyBilling = vmOptions.monthlyBilling;
                  self.planCode = self.planCode.replace(
                    'consumption',
                    'monthly',
                  );
                  $rootScope.$broadcast(
                    'compute.infrastructure.vm.monthlyBilling.status-update',
                    self.monthlyBilling.status,
                    'OK',
                    self,
                  );
                  return self.updatePrice();
                },
                (error) =>
                  $q.reject({
                    error: error.data,
                    requestName: 'activeMonthlyBilling',
                  }),
              )
              .finally(() => self),
          );
        }

        // Resize
        if (self.hasChange('flavors')) {
          promises.push(
            OvhApiCloudProjectInstance.v6()
              .resize(
                {
                  serviceName: self.serviceName,
                  instanceId: self.id,
                },
                {
                  flavorId: self.flavor.id,
                },
              )
              .$promise.then(
                (vmOptions) => {
                  self.status = vmOptions.status;
                  return self;
                },
                (error) =>
                  $q.reject({
                    error: error.data,
                    requestName: 'resize',
                  }),
              ),
          );
        }

        // Reinstall
        if (self.hasChange('images')) {
          promises.push(self.reinstall());
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
       * Init saveForEdition attribute.
       */
      VirtualMachineFactory.prototype.initEdition = function initEdition() {
        const self = this;
        self.saveForEdition = {
          name: angular.copy(self.name),
          monthlyBillingBoolean: angular.copy(self.monthlyBillingBoolean),
          image: angular.copy(self.image),
          flavor: angular.copy(self.flavor),
        };
      };

      /**
       *  Enable the edition mode.
       */
      VirtualMachineFactory.prototype.startEdition = function startEdition() {
        const self = this;
        // Edit
        if (self.status === 'ACTIVE') {
          self.openMonitoring = false;
          self.initEdition();
        }
        self.openMonitoring = false;
        self.openDetail = true;
      };

      /**
       *  Disable the edition mode.
       */
      VirtualMachineFactory.prototype.stopEdition = function stopEdition(
        cancel,
        vmWithChanges,
      ) {
        const self = this;

        if (!cancel && vmWithChanges) {
          self.name = vmWithChanges.name;
          self.monthlyBilling =
            vmWithChanges.monthlyBilling || self.monthlyBilling || undefined;
          self.monthlyBillingBoolean = vmWithChanges.monthlyBillingBoolean;
          self.price =
            vmWithChanges.flavor.price || vmWithChanges.price || undefined;
          self.image = vmWithChanges.image;
          self.flavor = vmWithChanges.flavor;
        }
        self.saveForEdition = false;
        self.openDetail = false;
      };

      /**
       *  Enable the monitoring mode.
       */
      VirtualMachineFactory.prototype.startMonitoring = function startMonitoring() {
        this.openMonitoring = true;
        this.openDetail = false;
      };

      /**
       *  Disable the monitoring mode.
       */
      VirtualMachineFactory.prototype.stopMonitoring = function stopMonitoring() {
        this.openMonitoring = false;
      };

      /**
       * [EDIT] Item has changes ?
       */
      VirtualMachineFactory.prototype.hasChange = function hasChange(
        targetSection,
      ) {
        const self = this;

        if (!self.saveForEdition) {
          return false;
        }

        if (targetSection) {
          switch (targetSection) {
            case 'name':
              return self.name !== self.saveForEdition.name;
            case 'flavors':
              return self.flavor
                ? !self.saveForEdition.flavor ||
                    self.flavor.id !== self.saveForEdition.flavor.id
                : false;
            case 'images':
              return self.image
                ? !self.saveForEdition.image ||
                    self.image.id !== self.saveForEdition.image.id
                : false;
            case 'monthlyBilling':
              return !!self.monthlyBilling !== self.monthlyBillingBoolean;
            default:
          }
        }

        return (
          self.hasChange('name') ||
          self.hasChange('flavors') ||
          self.hasChange('images') ||
          self.hasChange('monthlyBilling')
        );
      };

      /*= =========  Additionals actions  ========== */

      /**
       *  [API] Reinstall a vm.
       */
      VirtualMachineFactory.prototype.reinstall = function reinstall(imageId) {
        const self = this;
        const oldStatus = self.status;
        return OvhApiCloudProjectInstance.v6()
          .reinstall(
            {
              serviceName: self.serviceName,
              instanceId: self.id,
            },
            {
              imageId: imageId || self.image.id,
            },
          )
          .$promise.then(
            (vmOptions) => {
              self.status = vmOptions.status;
              $rootScope.$broadcast(
                'compute.infrastructure.vm.status-update',
                self.status,
                oldStatus,
                self,
              );
              return self.getFullInformations();
            },
            (error) =>
              $q.reject({
                error: error.data,
                requestName: 'reinstall',
              }),
          );
      };

      /**
       *  [API] Rescue a virtual machine.
       */
      VirtualMachineFactory.prototype.rescueMode = function rescueMode(
        enable,
        image,
      ) {
        const self = this;
        const oldStatus = self.status;
        this.status = enable ? 'RESCUING' : 'UNRESCUING';
        $rootScope.$broadcast(
          'compute.infrastructure.vm.status-update',
          self.status,
          oldStatus,
          self,
        );
        return OvhApiCloudProjectInstance.v6().rescueMode(
          {
            serviceName: self.serviceName,
            instanceId: self.id,
          },
          {
            imageId: image ? image.id : undefined,
            rescue: enable,
          },
        ).$promise;
      };

      /**
       *  [API] Reboot [soft|hard] a virtual machine.
       */
      VirtualMachineFactory.prototype.reboot = function reboot(type) {
        const self = this;
        const oldStatus = self.status;
        return OvhApiCloudProjectInstance.v6()
          .reboot(
            {
              serviceName: this.serviceName,
              instanceId: this.id,
            },
            {
              type: type || 'soft',
            },
          )
          .$promise.then(() => {
            self.status = type === 'hard' ? 'HARD_REBOOT' : 'REBOOT';
            $rootScope.$broadcast(
              'compute.infrastructure.vm.status-update',
              self.status,
              oldStatus,
              self,
            );
            return self;
          });
      };

      /**
       *  [API] Resume a virtual machine.
       */
      VirtualMachineFactory.prototype.resume = function resume() {
        return OvhApiCloudProjectInstance.v6().resume(
          {
            serviceName: this.serviceName,
            instanceId: this.id,
          },
          {},
        ).$promise;
      };

      /**
       *  [API] Create snapshot.
       */
      VirtualMachineFactory.prototype.backup = function backup(snapshotName) {
        const self = this;
        const oldStatus = self.status;
        return OvhApiCloudProjectInstance.v6()
          .backup(
            {
              serviceName: this.serviceName,
              instanceId: this.id,
            },
            {
              snapshotName,
            },
          )
          .$promise.then((result) => {
            self.status = 'SNAPSHOTTING';
            $rootScope.$broadcast(
              'compute.infrastructure.vm.status-update',
              self.status,
              oldStatus,
              self,
            );
            return result;
          });
      };

      /*= =========  ---  ========== */

      /**
       *  Prepare a vm to be JSON stringified by returning only attributes.
       */
      VirtualMachineFactory.prototype.prepareToJson = function prepareToJson() {
        if (this.status === 'DRAFT') {
          return {
            id: this.id,
            status: this.status,
            name: this.name,
            collapsed: this.collapsed,
            collapsedVolumes: this.collapsedVolumes,
            flavorId: this.flavorId || (this.flavor ? this.flavor.id : null),
            imageId: this.imageId || (this.image ? this.image.id : null),
            region: this.region || null,
            routedTo: this.routedTo || [],
            userData: this.userData,
          };
        }
        return {
          id: this.id,
          status: this.status,
          collapsed: this.collapsed,
          collapsedVolumes: this.collapsedVolumes,
        };
      };

      VirtualMachineFactory.prototype.generateMonitoringInference = function generateMonitoringInference() {
        const self = this;
        if (self.monitoringData && self.monitoringData.raw) {
          const rawData = this.monitoringData.raw;
          let maxPeriod;

          // ----- CPU -----
          if (rawData['cpu:used'] && !isEmpty(rawData['cpu:used'].values)) {
            maxPeriod = maxBy(rawData['cpu:used'].values, (v) =>
              angular.isNumber(v.value) ? v.value : Number.NEGATIVE_INFINITY,
            );
            this.monitoringData.cpu = {
              now: last(rawData['cpu:used'].values), // current CPU usage
              // does CPU reach alerting threshold over period?
              needUpgrade:
                maxPeriod.value >= CLOUD_MONITORING.vm.upgradeAlertThreshold,
              maxPeriod, // max CPU usage over given period
            };
          }

          // ----- RAM -----
          if (
            rawData['mem:used'] &&
            rawData['mem:max'] &&
            !isEmpty(rawData['mem:used'].values) &&
            !isEmpty(rawData['mem:max'].values)
          ) {
            const memTotal = head(rawData['mem:max'].values);
            maxPeriod = null;
            if (memTotal && memTotal.value > 0) {
              maxPeriod = maxBy(rawData['mem:used'].values, (v) =>
                angular.isNumber(v.value) ? v.value : Number.NEGATIVE_INFINITY,
              );
            }
            this.monitoringData.mem = {
              now: last(rawData['mem:used'].values), // current RAM usage
              total: memTotal, // total RAM available
              // does RAM reach alerting threshold over period ?
              needUpgrade:
                (maxPeriod.value / memTotal.value) * 100.0 >=
                CLOUD_MONITORING.vm.upgradeAlertThreshold,
              maxPeriod, // max RAM usage over given period
              unit: rawData['mem:used'].unit, // RAM units (MB GB ...)
            };
            if (this.monitoringData.mem.now && memTotal) {
              // current RAM usage in percent
              this.monitoringData.mem.nowPercent =
                this.monitoringData.mem.now.value / memTotal.value;
            }
          }
        }
      };

      /**
       *  Get vm monitoring informations
       */
      VirtualMachineFactory.prototype.getMonitoringData = function getMonitoringData() {
        const self = this;
        const promiseToExecute = [];

        if (!self.monitoringData) {
          self.monitoringData = {
            raw: {},
            cpu: {
              needUpgrade: false,
            },
            mem: {
              needUpgrade: false,
            },
            loading: true,
          };
        }

        CLOUD_MONITORING.vm.type.forEach((type) => {
          promiseToExecute.push(
            OvhApiCloudProjectInstance.v6()
              .monitoring({
                serviceName: self.serviceName,
                instanceId: self.id,
                period: CLOUD_MONITORING.vm.period,
                type,
              })
              .$promise.then((data) => {
                self.monitoringData.raw[type] = data;
                return data;
              }),
          );
        });

        return $q.allSettled(promiseToExecute).finally(() => {
          self.generateMonitoringInference();
          self.monitoringData.loading = false;
        });
      };

      return VirtualMachineFactory;
    },
  );
