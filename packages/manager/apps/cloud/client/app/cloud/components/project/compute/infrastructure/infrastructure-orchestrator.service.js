import every from 'lodash/every';
import filter from 'lodash/filter';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import forEach from 'lodash/forEach';
import head from 'lodash/head';
import indexOf from 'lodash/indexOf';
import last from 'lodash/last';
import set from 'lodash/set';
import sortBy from 'lodash/sortBy';

/**
 *  Cloud Infrastructure Orchestrator. Beyond it's the sun!
 *  =======================================================
 *
 *  =README=
 *  This orchestrator is used to init and manage a Cloud infrastructure.
 */
angular
  .module('managerApp')
  .service(
    'CloudProjectComputeInfrastructureOrchestrator',
    function CloudProjectComputeInfrastructureOrchestrator(
      $q,
      $rootScope,
      $translate,
      CloudProjectComputeInfrastructureFactory,
      CloudProjectComputeVolumesOrchestrator,
      CucUserPref,
      OvhApiCloudProjectFlavor,
      OvhApiCloudProjectImage,
      OvhApiCloudProjectInstance,
      OvhApiCloudProjectIp,
      OvhApiCloudProjectRegion,
      OvhApiCloudProjectSshKey,
      Poller,
      CLOUD_INSTANCE_DEFAULTS,
    ) {
      // Warning: all values must be reset at init (see resetDatas())
      const self = this;
      let editedVm;
      let monitoredVm;
      let paramEdition = null; // type enum {NAME, POWER, OS}
      const resetDatas = function resetDatas() {
        // The full infra to display
        self.infra = null;

        // Project type (existing, template, template-new)
        self.serviceType = null;

        // Current edited VM
        editedVm = null;
        monitoredVm = null;

        // Stop polling if launched
        self.killPollVms();
        self.killPollIps();
      };

      /*= =========================
    =            VMs           =
    ========================== */

      /**
       * Get the default vm configuration for a specified region
       */
      function getDefaultVmConfigurationForRegion(defaultRegion) {
        const options = {
          name: $translate.instant('cpci_vm_default_name', {
            index: self.infra.vrack.getNextIndex() + 1,
          }),
          region: defaultRegion,
        };
        const optionsQueue = [];

        // get the flavor id
        optionsQueue.push(
          OvhApiCloudProjectFlavor.v6()
            .query({
              serviceName: self.infra.serviceName,
            })
            .$promise.then((flavors) => {
              set(
                options,
                'flavorId',
                (
                  find(flavors, {
                    region: options.region,
                    name: CLOUD_INSTANCE_DEFAULTS.flavor,
                  }) || {}
                ).id,
              );
            }),
        );

        // get the image id
        optionsQueue.push(
          OvhApiCloudProjectImage.v6()
            .query({
              serviceName: self.infra.serviceName,
            })
            .$promise.then((images) => {
              set(
                options,
                'imageId',
                (
                  find(images, {
                    region: options.region,
                    name: CLOUD_INSTANCE_DEFAULTS.image,
                  }) || {}
                ).id,
              );
            }),
        );

        // get the ssh key id - the first ssh key present in given region
        // remove this if default image becomes windows type
        optionsQueue.push(
          OvhApiCloudProjectSshKey.v6()
            .query({
              serviceName: self.infra.serviceName,
            })
            .$promise.then((sshKeys) => {
              set(
                options,
                'sshKeyId',
                (
                  find(
                    sshKeys,
                    (sshKey) => sshKey.regions.indexOf(options.region) > -1,
                  ) || {}
                ).id,
              );
            }),
        );

        return $q.allSettled(optionsQueue).then(
          () => {
            if (
              self.infra.vrack.publicCloud &&
              self.infra.vrack.publicCloud.length() > 0
            ) {
              // use the most recent virtual machine parameters
              const mostRecentVm = last(
                sortBy(self.infra.vrack.publicCloud.items, 'created'),
              );
              if (mostRecentVm) {
                if (mostRecentVm.image) {
                  options.imageId = mostRecentVm.image.id;
                }
                if (mostRecentVm.flavor) {
                  options.flavorId = mostRecentVm.flavor.id;
                  options.isFlavorSuggested = true;
                }
                if (mostRecentVm.region) {
                  options.region = mostRecentVm.region;
                }
                if (mostRecentVm.sshKey) {
                  options.sshKeyId = mostRecentVm.sshKey.id;
                }
                options.monthlyBillingBoolean =
                  mostRecentVm.monthlyBillingBoolean;
              }
            }
            return options;
          },
          () => options,
        );
      }

      /**
       *  Get the default vm configuration options
       */
      const getDefaultVmConfiguration = function getDefaultVmConfiguration() {
        return OvhApiCloudProjectRegion.v6()
          .query({
            serviceName: self.infra.serviceName,
          })
          .$promise.then((regionList) => {
            // check if the default region exists
            let { region } = CLOUD_INSTANCE_DEFAULTS;
            if (indexOf(regionList, region) === -1) {
              region = head(regionList);
            }
            return getDefaultVmConfigurationForRegion(region);
          });
      };

      /**
       *  Add a virtual machine into project infrastructure
       */
      this.addNewVmToList = function addNewVmToList(vmOptions) {
        let vm;

        return $q
          .when()
          .then(() => {
            if (!vmOptions) {
              return getDefaultVmConfiguration();
            }
            return vmOptions;
          })
          .then((options) => {
            // Add Draft VM to list
            vm = self.infra.vrack.addVmToPublicCloudList(options);
            vm.status = 'DRAFT';
            self.saveToUserPref();
            return vm;
          });
      };

      /**
       *  Launch the vm creation.
       */
      this.saveNewVm = function saveNewVm(vm) {
        const oldId = vm.id;
        return vm.launchCreation().then(() => {
          // we must do it because old id is a fake one
          self.infra.vrack.publicCloud.replaceItem(oldId, vm);
          self.saveToUserPref();
          self.pollVms(); // WARNING: Never return promise because pulling had to live on her side
        });
      };

      /**
       * Launch vm creation, creating multiple copies.
       */
      this.saveMultipleNewVms = function saveMultipleNewVms(vmBase, count) {
        return OvhApiCloudProjectInstance.v6()
          .bulk(
            {
              serviceName: self.infra.serviceName,
            },
            {
              flavorId: vmBase.flavor.id,
              imageId: vmBase.image.id,
              name: vmBase.name,
              region: vmBase.region,
              sshKeyId: vmBase.sshKey ? vmBase.sshKey.id : undefined,
              monthlyBilling: vmBase.monthlyBillingBoolean,
              userData: vmBase.userData ? vmBase.userData : undefined,
              number: count,
              networks: vmBase.networks,
            },
          )
          .$promise.then((vms) => {
            self.infra.vrack.publicCloud.removeItem(vmBase.id); // remove draft vm
            self.pollVms(); // updates vm list
            return vms;
          });
      };

      /**
       *  Set the virtual machine that is currently in edition
       */
      this.turnOnVmEdition = function turnOnVmEdition(vm) {
        editedVm = vm;
        editedVm.startEdition();
      };

      /**
       *  Close/Reset the virtual machine that is currently in edition
       */
      this.turnOffVmEdition = function turnOffVmEdition(reset, vmWithChanges) {
        editedVm.stopEdition(!!reset, vmWithChanges);
        editedVm = null;
      };

      /**
       *  Open monitoring panel
       */
      this.openMonitoringPanel = function openMonitoringPanel(vm) {
        monitoredVm = vm;
        vm.startMonitoring();
      };

      this.getMonitoredVm = function getMonitoredVm() {
        return monitoredVm;
      };

      /**
       *  Get the virtual machine that is currently in edition
       */
      this.getEditedVm = function getEditedVm() {
        return editedVm;
      };

      /**
       *  Get parameters for current edition
       */
      this.getEditVmParam = function getEditVmParam() {
        return paramEdition;
      };

      /**
       *  Get parameters for current edition
       */
      this.setEditVmParam = function setEditVmParam(param) {
        paramEdition = param;
      };

      /**
       *  Save the VM modifications
       */
      this.saveEditedVm = function saveEditedVm(vm) {
        return vm.edit().then(() => {
          self.saveToUserPref();
          self.pollVms(); // WARNING: Never return promise because pulling had to live on her side
        });
      };

      /**
       *  Delete VM
       */
      this.deleteVm = function deleteVm(vm) {
        if (vm.status === 'DRAFT') {
          return $q.when(true).then(() => {
            self.infra.vrack.removeVmFromPublicCloudList(vm);
            self.refreshLinks();
            self.saveToUserPref();
          });
        }
        return vm.remove().then(() => {
          self.saveToUserPref();
          self.pollVms(); // WARNING: Never return promise because pulling had to live on her side
        });
      };

      /**
       *  Rescue VM
       */
      this.rescueVm = function rescueVm(vm, enable, image) {
        return vm.rescueMode(enable, image).then((result) => {
          self.pollVms();
          return result;
        });
      };

      /**
       *  Reboot [soft|hard] VM
       */
      this.rebootVm = function rebootVm(vm, type) {
        return vm.reboot(type).then(() => {
          self.pollVms(); // WARNING: Never return promise because pulling had to live on her side
        });
      };

      /**
       *  Resume VM
       */
      this.resumeVm = function resumeVm(vm) {
        return vm.resume().then(() => {
          self.pollVms(); // WARNING: Never return promise because pulling had to live on her side
        });
      };

      /**
       *  Reinstall VM
       */
      this.reinstallVm = function reinstallVm(vm) {
        return vm.reinstall().then(() => {
          self.pollVms(); // WARNING: Never return promise because pulling had to live on her side
        });
      };

      /**
       *  Create a new snapshot of VM
       */
      this.backupVm = function backupVm(vm, snapshotName) {
        return vm.backup(snapshotName).then(() => {
          self.pollVms(); // WARNING: Never return promise because pulling had to live on her side
        });
      };

      /**
       *  Collapse all vm
       */
      this.collapseAllVm = function collapseAllVm() {
        this.infra.vrack.collapseAll();
        this.saveToUserPref(); // ------ TODO: dangerous, this do an ASYNC call
      };

      /**
       *  Uncollapse all vm
       */
      this.uncollapseAllVm = function uncollapseAllVm() {
        this.infra.vrack.uncollapseAll();
        this.saveToUserPref(); // ------ TODO: dangerous, this do an ASYNC call
      };

      /**
       *  Toggle the collapsed state of given vm and save to userPref
       */
      this.toggleVmCollapsedState = function toggleVmCollapsedState(vm) {
        set(vm, 'collapsed', !vm.collapsed);
        this.saveToUserPref(); // ------ TODO: dangerous, this do an ASYNC call
        return $q.when(vm);
      };

      /**
       *  Toggle the collapsed state of given vm and save to userPref
       */
      this.toggleCollapsedVolumes = function toggleCollapsedVolumes(vm) {
        set(vm, 'collapsedVolumes', !vm.collapsedVolumes);
        this.saveToUserPref(); // ------ TODO: dangerous, this do an ASYNC call
        return $q.when(vm);
      };

      this.loadVmMonitoringData = function loadVmMonitoringData() {
        forEach(this.infra.vrack.publicCloud.items, (instance) => {
          instance.getMonitoringData();
        });
      };

      /* -----  End of VMs  ------*/

      /*= =========================
     =         VLANs           =
     ========================== */

      this.hasVrack = function hasVrack() {
        return this.infra.vlan.hasVrack();
      };

      /*= =========================
    =            IP            =
    ========================== */

      /**
       * Attach an IP to a VM
       */
      this.attachIptoVm = function attachIptoVm(ip, vm) {
        if (ip.status === 'DRAFT') {
          // @todo
          return $q.when('TODO').then(() => {
            self.saveToUserPref();
          });
        }
        return ip.attach(vm.id).then(() => {
          switch (ip.type) {
            case 'failover':
              // WARNING: Never return promise because pulling had to live on her side
              self.pollIps(ip.type);
              break;
            default:
              break;
          }
          // @todo: other types
        });
      };

      function rearrangeIpv6(instance) {
        const publicIpV4Index = findIndex(instance.ipAddresses, {
          version: 4,
          type: 'public',
        });
        const publicIpV6Index = findIndex(instance.ipAddresses, {
          version: 6,
          type: 'public',
        });

        if (publicIpV4Index !== -1 && publicIpV6Index !== -1) {
          // eslint-disable-next-line no-param-reassign
          instance.ipAddresses[publicIpV4Index].ipV6 = {
            ip: instance.ipAddresses[publicIpV6Index].ip,
            gateway: instance.ipAddresses[publicIpV6Index].gatewayIp,
          };
          instance.ipAddresses.splice(publicIpV6Index, 1);
        }
      }

      /**
       *  Get list of IPs Public (from the list of VMs)
       */
      function getPublicIpAddressesFromInstances(vms) {
        const publicIpAddresses = [];
        angular.forEach(vms, (vm) => {
          rearrangeIpv6(vm);

          angular.forEach(
            filter(vm.ipAddresses, { type: 'public' }),
            (publicIpAddress) => {
              set(publicIpAddress, 'id', publicIpAddress.ip);
              set(publicIpAddress, 'routedTo', vm.id);
              publicIpAddresses.push(publicIpAddress);
            },
          );
        });
        return publicIpAddresses;
      }

      /**
       *  Make the links between VMs and IPs
       */
      this.refreshLinks = function refreshLinks() {
        angular.forEach(self.infra.internet.ipList.items, (ip) => {
          self.infra.refreshVmsRoutedToFromIp(ip);
        });
        $rootScope.$broadcast('infra.refresh.links');
      };

      /* -----  End of IPs  ------*/

      /*= ==============================
    =            POLLING            =
    =============================== */

      /**
       *  --- [IPs] --- [update] ---
       *
       * Updates instances from API with instances from this factory
       *  /!\ This don't add or remove instances!
       */
      function updateIpsWithIpsFromApi(ipsFromApi) {
        angular.forEach(ipsFromApi, (ipFromApi) => {
          const ipFromFactory = self.infra.internet.getIpById(ipFromApi.id);
          if (!ipFromFactory) {
            return;
          }
          ipFromFactory.setInfos(ipFromApi);
        });
      }

      /**
       *  --- [IPs] --- [addOrDelete] ---
       *
       *  Add or remove IPs from API with IPs from this factory
       *  /!\ This can't update existing datas!!!
       */
      function addOrDeleteIpsWithIpsFromApi(
        ipsFromApi,
        type,
        forceRemoveDrafts,
      ) {
        /*= =========  Remove deleted IPs  ========== */

        const deletedIps = filter(self.infra.internet.ipList.items, (ip) => {
          // don't remove drafts!
          if (
            ip.type !== type ||
            (!forceRemoveDrafts && ip.status === 'DRAFT')
          ) {
            return false;
          }
          return !find(ipsFromApi, { id: ip.id });
        });

        angular.forEach(deletedIps, (ip) => {
          self.infra.internet.removeIpFromList(ip);
        });

        /*= =========  Add new IPs  ========== */

        const addedIps = filter(
          ipsFromApi,
          (ip) => !self.infra.internet.getIpById(ip.id),
        );
        angular.forEach(addedIps, (ip) => {
          set(ip, 'type', type);
          // eslint-disable-next-line no-param-reassign
          ip = self.infra.internet.addIpToList(ip);
        });

        // return true if updated
        return !!(deletedIps.length || addedIps.length);
      }

      /**
       *  Triggered by polling: Update IPs list
       *
       *  /!\ take care to don't update all datas, user can be in edition for example.
       */
      function updateIpsFromPolling(ips, type) {
        let haveChanges = false;

        // Update existing IPs
        haveChanges = updateIpsWithIpsFromApi(ips, type) || haveChanges;
        // Add new IPs, and delete removed IPs
        haveChanges = addOrDeleteIpsWithIpsFromApi(ips, type) || haveChanges;

        self.refreshLinks();

        if (haveChanges) {
          self.saveToUserPref();
        }
        return $q.when(ips);
      }

      /**
       *  --- [VMs] --- [update] ---
       *
       * Updates instances from API with instances from this factory
       *  /!\ This don't add or remove instances!
       */
      function updateInstancesWithInstancesFromApi(
        instancesFromApi,
        updateOnlySpecificDatas,
      ) {
        let haveChanges = false;

        angular.forEach(instancesFromApi, (instanceFromApi) => {
          const instanceFromFactory = self.infra.vrack.getVmById(
            instanceFromApi.id,
          );

          const currentEditedVm = self.getEditedVm();

          if (!instanceFromFactory) {
            return;
          }

          if (updateOnlySpecificDatas) {
            // Update status
            if (instanceFromFactory.status !== instanceFromApi.status) {
              const oldStatus = instanceFromFactory.status;
              const hardRebootingSuspended =
                instanceFromFactory.status === 'HARD_REBOOT' &&
                instanceFromApi.status === 'SUSPENDED';
              // if hard rebooting a suspended project the API do not update the status correctly
              // this bug is not easilly fixable for the API so we fix it on UX side
              if (!hardRebootingSuspended) {
                haveChanges = true;
                instanceFromFactory.status = instanceFromApi.status;
                $rootScope.$broadcast(
                  'compute.infrastructure.vm.status-update',
                  instanceFromApi.status,
                  oldStatus,
                  instanceFromFactory,
                );
              }
            }

            // Update this datas ONLY if vm is not in edition
            if (
              !currentEditedVm ||
              (currentEditedVm &&
                currentEditedVm.id &&
                currentEditedVm.id !== instanceFromApi.id)
            ) {
              // Update image reinstall
              if (
                instanceFromApi.imageId &&
                instanceFromFactory.image &&
                instanceFromFactory.image.id &&
                instanceFromApi.imageId !== instanceFromFactory.image.id
              ) {
                instanceFromFactory.imageId = instanceFromApi.imageId;
                instanceFromFactory.getFullInformations();
                haveChanges = true;
              }

              // Update flavor upscaling
              if (
                instanceFromApi.flavorId &&
                instanceFromFactory.flavor &&
                instanceFromFactory.flavor.id &&
                instanceFromApi.flavorId !== instanceFromFactory.flavor.id
              ) {
                instanceFromFactory.flavorId = instanceFromApi.flavorId;
                instanceFromFactory.getFullInformations();
                haveChanges = true;
              }
            }

            // Update ipAddresses array
            if (
              instanceFromApi.ipAddresses &&
              instanceFromApi.ipAddresses.length &&
              (!instanceFromFactory.ipAddresses ||
                instanceFromFactory.ipAddresses.length !==
                  instanceFromApi.ipAddresses.length)
            ) {
              instanceFromFactory.ipAddresses = instanceFromApi.ipAddresses;
              haveChanges = true;
            }

            // Update monthlyBilling
            if (
              !instanceFromFactory.monthlyBilling &&
              instanceFromApi.monthlyBilling
            ) {
              haveChanges = true;
              instanceFromFactory.monthlyBilling = angular.copy(
                instanceFromApi.monthlyBilling,
              );
            }

            // Update monthlyBilling status
            if (
              instanceFromFactory.monthlyBilling &&
              instanceFromApi.monthlyBilling &&
              instanceFromFactory.monthlyBilling.status !==
                instanceFromApi.monthlyBilling.status
            ) {
              haveChanges = true;
              const oldStatus = instanceFromFactory.monthlyBilling.status;
              instanceFromFactory.monthlyBilling.status =
                instanceFromApi.monthlyBilling.status;
              $rootScope.$broadcast(
                'compute.infrastructure.vm.monthlyBilling.status-update',
                instanceFromApi.status,
                oldStatus,
                instanceFromFactory,
              );
            }
          } else {
            // Updates all infos
            instanceFromFactory.setInfos(instanceFromApi);
            haveChanges = true;
          }
        });

        return haveChanges;
      }

      /*= ===================================================
      =            LOCAL DATAS UPGRADE (by API)            =
      ======================================================
      * =README=
      * Add, upgrade, and delete VMs or IPs lists with datas from APIs.
      * Used at initialization, and with polling.
      **************************************************** */

      /**
       *  --- [VMs] --- [addOrDelete] ---
       *
       *  Add or remove instances from API with instances from this factory
       *  /!\ This can't update existing datas!!!
       */
      function addOrDeleteInstancesWithInstancesFromApi(
        instancesFromApi,
        forceRemoveDrafts,
      ) {
        /*= =========  Remove deleted instances  ========== */

        const deletedInstances = filter(
          self.infra.vrack.publicCloud.items,
          (vm) => {
            // don't remove drafts!
            if (!forceRemoveDrafts && vm.status === 'DRAFT') {
              return false;
            }
            const instance = find(instancesFromApi, { id: vm.id });
            return !instance || instance.status === 'DELETED';
          },
        );

        angular.forEach(deletedInstances, (vm) => {
          self.infra.vrack.removeVmFromPublicCloudList(vm);
        });

        /*= =========  Add new instances  ========== */

        const addedInstances = filter(
          instancesFromApi,
          (vm) => vm.status !== 'DELETED' && !self.infra.vrack.getVmById(vm.id),
        );
        angular.forEach(addedInstances, (vm) => {
          self.infra.vrack.addVmToPublicCloudList(vm);
        });

        // return true if updated
        return !!(deletedInstances.length || addedInstances.length);
      }

      /* -----  End of LOCAL DATAS UPGRADE  ------*/
      /**
       *  Triggered by polling: Update instances list
       *
       *  /!\ take care to don't update all datas, user can be in edition for example.
       */
      function updateInstancesFromPolling(instances) {
        let haveChanges = false;

        // Update existing VMs
        haveChanges =
          updateInstancesWithInstancesFromApi(instances, true) || haveChanges;
        // Add new VMs, and delete removed VMs
        haveChanges =
          addOrDeleteInstancesWithInstancesFromApi(instances) || haveChanges;

        // Public IPs are into the instance infos, so we need to took them
        const publicIpAddresses = getPublicIpAddressesFromInstances(instances);
        updateIpsWithIpsFromApi(publicIpAddresses, 'public');
        addOrDeleteIpsWithIpsFromApi(publicIpAddresses, 'public');

        self.refreshLinks();

        if (haveChanges) {
          self.saveToUserPref();
          CloudProjectComputeVolumesOrchestrator.pollVolumes(); // [async]
        }
        return $q.when(instances);
      }

      /**
       *  --- [VMs] --- POLLING ---
       *
       *  Poll VM query
       */
      this.pollVms = function pollVms() {
        const continueStatus = [
          'DELETING',
          'BUILDING',
          'HARD_REBOOT',
          'REBOOT',
          'REBUILD',
          'REVERT_RESIZE',
          'VERIFY_RESIZE',
          'MIGRATING',
          'RESIZE',
          'BUILD',
          'RESCUING',
          'UNRESCUING',
          'RESCUE',
          'SNAPSHOTTING',
          'RESUMING',
        ];

        Poller.poll(`/cloud/project/${self.infra.serviceName}/instance`, null, {
          successRule(vm) {
            return (
              (!vm.monthlyBilling ||
                (vm.monthlyBilling &&
                  vm.monthlyBilling.status !== 'activationPending')) &&
              every(
                continueStatus,
                (continueState) => vm.status !== continueState,
              )
            );
          },
          namespace: 'cloud.infra.vms',
          notifyOnError: false,
        }).then(
          (vms) => {
            updateInstancesFromPolling(vms);
          },
          (err) => {
            if (err && err.status) {
              // eslint-disable-next-line no-console
              console.warn('pollVms', err);
              // @todo add bugkiller here
            }
          },
          (vms) => {
            updateInstancesFromPolling(vms);
          },
        );
      };

      /**
       *  --- [VMs] --- POLLING KILL ---
       *
       *  Kill the Poll VM query
       */
      this.killPollVms = function killPollVms() {
        Poller.kill({ namespace: 'cloud.infra.vms' });
      };

      // ---

      /**
       *  --- [IPs] --- POLLING ---
       *
       *  Poll IPs list
       *  [ip] : the type of the IPs
       */
      this.pollIps = function pollIps(type) {
        return Poller.poll(
          `/cloud/project/${self.infra.serviceName}/ip/${type}`,
          null,
          {
            successRule(ip) {
              return ip.status === 'ok';
            },
            namespace: 'cloud.infra.ips',
          },
        ).then(
          (ips) => {
            updateIpsFromPolling(ips, type);
          },
          (err) => {
            if (err && err.status) {
              // eslint-disable-next-line no-console
              console.warn('pollIps', err);
              // @todo add bugkiller here
            }
          },
          (ips) => {
            updateIpsFromPolling(ips, type);
          },
        );
      };

      /**
       *  --- [IPs] --- POLLING KILL ---
       *
       *  Kill the Poll IPs query
       */
      this.killPollIps = function killPollIps() {
        Poller.kill({ namespace: 'cloud.infra.ips' });
      };

      /* -----  End of Polling  ------*/

      /*= ===================================
    =            UserPref            =
    ==================================== */

      this.saveToUserPref = function saveToUserPref() {
        return CucUserPref.set(
          `cloud_project_${self.infra.serviceName}_infra`,
          self.infra.prepareToJson(),
        );
      };

      this.createFromUserPref = function createFromUserPref(serviceName) {
        const key = `cloud_project_${serviceName}_infra`;
        return CucUserPref.get(key).then(
          (infra) => {
            set(infra, 'serviceName', serviceName);
            return new CloudProjectComputeInfrastructureFactory(infra);
          },
          () =>
            new CloudProjectComputeInfrastructureFactory({
              serviceName,
            }),
        );
      };

      /**
       * Initialize an infrastructure
       */
      function initExistingProject(opts) {
        return self
          .createFromUserPref(opts.serviceName)
          .then((infraFromUserPref) => {
            const initQueue = [];

            self.infra = infraFromUserPref;

            /*= =========  VMs  ========== */

            initQueue.push(
              OvhApiCloudProjectInstance.v6()
                .query({
                  serviceName: self.infra.serviceName,
                })
                .$promise.then((instances) => {
                  forEach(instances, (instance) => {
                    rearrangeIpv6(instance);
                  });

                  // Merge with local datas
                  updateInstancesWithInstancesFromApi(instances);
                  addOrDeleteInstancesWithInstancesFromApi(instances, true);

                  // Public IPs are into the instance infos, so we need to took them
                  const publicIpAddresses = getPublicIpAddressesFromInstances(
                    instances,
                  );
                  updateIpsWithIpsFromApi(publicIpAddresses, 'public');
                  addOrDeleteIpsWithIpsFromApi(
                    publicIpAddresses,
                    'public',
                    true,
                  );
                }),
            );

            /*= =========  IPs  ========== */

            const ipTypes = ['failover'];
            angular.forEach(ipTypes, (ipType) => {
              initQueue.push(
                OvhApiCloudProjectIp[ipType]
                  .v6()
                  .query({
                    serviceName: self.infra.serviceName,
                  })
                  .$promise.then((ips) => {
                    angular.forEach(ips, (ip) => {
                      set(ip, 'type', ipType);
                    });
                    return ips;
                  })
                  .then((ips) => {
                    // Merge with local datas
                    updateIpsWithIpsFromApi(ips, ipType);
                    addOrDeleteIpsWithIpsFromApi(ips, ipType, true);
                  }),
              );
            });

            return $q.all(initQueue).then(() => {
              self.refreshLinks();
              self.pollVms(); // WARNING: Never return promise because pulling had to live on her side
              self.pollIps('failover'); // WARNING: Never return promise because pulling had to live on her side
              return self.infra;
            });
          });
      }

      /**
       *  Initialize a new Infrastructure
       */
      this.init = function init(opts) {
        resetDatas();
        return initExistingProject(opts);
      };
    },
  );
