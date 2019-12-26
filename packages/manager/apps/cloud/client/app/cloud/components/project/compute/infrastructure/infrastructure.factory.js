import difference from 'lodash/difference';
import set from 'lodash/set';

angular
  .module('managerApp')
  .factory(
    'CloudProjectComputeInfrastructureFactory',
    (
      CloudProjectComputeInfraVrackFactory,
      CloudProjectComputeInfraInternetFactory,
      CloudProjectComputeInfraVrackVlanFactory,
    ) => {
      /**
       *  Defines a cloud project compute infrastructure
       *
       *  @param    {Object}  optionsParam
       *                      Options for creating a new CloudProjectInfrastructure
       *  @param    {Object}  optionsParam.vrack
       *                      Options of the CloudProjectComputeInfrastructure Vrack
       *  @param    {Object}  optionsParam.internet
       *                      Options of the CloudProjectComputeInfrastructure Internet
       */
      const InfrastructureFactory = (function InfrastructureFactory() {
        return function CloudProjectComputeInfrastructureFactory(optionsParam) {
          let options = optionsParam;
          if (!options) {
            options = {};
          }

          this.serviceName = options.serviceName || null;

          this.vrack = new CloudProjectComputeInfraVrackFactory(
            angular.extend(options.vrack || {}, {
              serviceName: this.serviceName,
            }),
          );
          this.vlan = new CloudProjectComputeInfraVrackVlanFactory(
            angular.extend(options.vrack || {}, {
              serviceName: this.serviceName,
            }),
          );
          this.internet = new CloudProjectComputeInfraInternetFactory(
            angular.extend(options.internet || {}, {
              serviceName: this.serviceName,
            }),
          );
        };
      })();

      // /////////////////////////////
      // /         METHODS          //
      // /////////////////////////////

      /**
       *  Given an IP, it will refresh "routedTo" of VMs where this IP is routed.
       *  Note: If VM is not present anymore, delete its ID from the routedTo of the IP.
       *
       *  We need to ensure that the arrays of "routedTo" are sync between VMs and IPs.
       *  Because a VM can appear before an IP (or reverse),
       *  jsPlumb will not draw a link if the endpoint is not present.
       *  /!\ Please put only REAL links in routedTo (aka present in API), not fake one.
       */
      InfrastructureFactory.prototype.refreshVmsRoutedToFromIp = function refreshVmsRoutedToFromIp(
        ip,
      ) {
        let routedVm;

        const routedToToRemove = [];

        const self = this;

        angular.forEach(ip.routedTo, (routedVmId) => {
          routedVm = self.vrack.publicCloud.items[routedVmId];
          if (!routedVm) {
            routedToToRemove.push(routedVmId);
            return;
          }
          if (!~routedVm.routedTo.indexOf(ip.id)) {
            routedVm.routedTo.push(ip.id);
          }
        });

        // VMs are not present anymore: delete the VMs ID from IP's routedTo
        if (routedToToRemove.length) {
          set(ip, 'routedTo', difference(ip.routedTo, routedToToRemove));
        }
        return ip;
      };

      // ---

      /**
       *  Prepare object to json encode function to avoid function being encoded
       */
      InfrastructureFactory.prototype.prepareToJson = function prepareToJson() {
        return {
          vrack: this.vrack.prepareToJson(),
          internet: this.internet.prepareToJson(),
        };
      };

      return InfrastructureFactory;
    },
  );
