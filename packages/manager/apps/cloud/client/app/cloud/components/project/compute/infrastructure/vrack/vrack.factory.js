import map from 'lodash/map';
import set from 'lodash/set';

angular
  .module('managerApp')
  .factory(
    'CloudProjectComputeInfraVrackFactory',
    (CloudProjectComputeInfraVrackVmFactory, CucOrderedHashFactory) => {
      /**
       *  Defines a cloud project compute infrastructure vrack
       *
       *  @param    {Object}  options
       *                      Options for creating a new CloudProjectInfraVrack
       *  @param    {Array}   options.publicCloud
       *                      List of VirtualMachine options or VirtualMachine instances
       */
      const VrackFactory = (function VrackFactory() {
        return function CloudProjectComputeInfraVrackFactory(optionsParam) {
          const self = this;
          let options = optionsParam;

          if (!options) {
            options = {};
          }

          this.serviceName = options.serviceName || null;
          this.publicCloud = new CucOrderedHashFactory();

          // init public cloud
          if (options.publicCloud && options.publicCloud.length) {
            angular.forEach(options.publicCloud, (publicVm) => {
              self.addVmToPublicCloudList(publicVm);
            });
          }
        };
      })();

      // /////////////////////
      //      METHODS      //
      // /////////////////////

      /**
       *  Get a vm from its id. Check first in public cloud and then in private cloud.
       */
      VrackFactory.prototype.getVmById = function getVmById(vmId) {
        return this.publicCloud.get(vmId);
      };

      /**
       *  Get next index of vm in current Vrack (used for giving the default vm name option)
       */
      VrackFactory.prototype.getNextIndex = function getNextIndex() {
        return this.publicCloud.length();
      };

      // ---

      /**
       *  Add a public vm into Vrack list
       */
      VrackFactory.prototype.addVmToPublicCloudList = function addVmToPublicCloudList(
        vm,
      ) {
        set(vm, 'serviceName', this.serviceName); // Add projectId to VM
        // eslint-disable-next-line no-param-reassign, no-use-before-define
        vm = checkVm(vm);
        // Avoid conflict of adding an existing vm
        if (!this.publicCloud.get(vm)) {
          this.publicCloud.push(vm);
        }
        return vm;
      };

      /**
       *  Remove given Virtual Machine from vrack public cloud list
       */
      VrackFactory.prototype.removeVmFromPublicCloudList = function removeVmFromPublicCloudList(
        vm,
      ) {
        this.publicCloud.removeItem(vm);
        return vm;
      };

      /**
       *  Collapse all Vms
       */
      VrackFactory.prototype.collapseAll = function collapseAll() {
        const items = this.publicCloud.getItems();
        angular.forEach(items, (vm) => {
          set(vm, 'collapsed', true);
        });
      };

      /**
       *  Uncollapse all Vms
       */
      VrackFactory.prototype.uncollapseAll = function uncollapseAll() {
        const items = this.publicCloud.getItems();
        angular.forEach(items, (vm) => {
          set(vm, 'collapsed', false);
        });
      };

      /**
       *  Prepare object to json encode function to avoid function being encoded.
       */
      VrackFactory.prototype.prepareToJson = function prepareToJson() {
        const self = this;
        return {
          publicCloud: map(this.publicCloud.sortedKeys, (vmId) =>
            self.publicCloud.get(vmId).prepareToJson(),
          ),
        };
      };

      // /////////////////////
      //      FUNCTIONS    //
      // /////////////////////

      /**
       *  Check if vm is already an instance or an options object
       */
      function checkVm(vm) {
        return vm instanceof CloudProjectComputeInfraVrackVmFactory
          ? vm
          : new CloudProjectComputeInfraVrackVmFactory(vm);
      }

      return VrackFactory;
    },
  );
