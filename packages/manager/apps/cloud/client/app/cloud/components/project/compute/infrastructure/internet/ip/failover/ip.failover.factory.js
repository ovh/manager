import flatten from 'lodash/flatten';

angular
  .module('managerApp')
  .factory(
    'CloudProjectComputeInfraIpFailoverFactory',
    (OvhApiIpReverse, OvhApiCloudProjectIpFailover) => {
      /**
       *  Defines a cloud project compute infrastructure Failover IP
       *
       *  /!\ Take care when modifying this!!! Check setInfos, and prepareToJson too.
       */
      const IpFailoverFactory = (function IpFailoverFactory() {
        return function CloudProjectComputeInfraIpFailoverFactory(
          optionsParam,
        ) {
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
                status: 'ok',
              },
              options,
            ),
          );
        };
      })();

      // /////////////////////
      //      METHODS      //
      // /////////////////////

      /**
       *  Set customs options (for init, and updates)
       *  -> @devs: put your customs values here
       */
      IpFailoverFactory.prototype.getCustomOptions = function getCustomOptions(
        options,
      ) {
        return angular.extend(options, {
          type: 'failover',
          routedTo: options.routedTo ? flatten([options.routedTo]) : [], // Ensure routedTo is always an array
        });
      };

      /**
       *  Set infos after initialization
       */
      IpFailoverFactory.prototype.setInfos = function setInfos(optionsParam) {
        let options = optionsParam;
        // Set custom values
        options = this.getCustomOptions(options || {});

        // Ok now extend it
        angular.extend(this, options);

        return this;
      };

      /**
       * Attach an IP to a vm
       */
      IpFailoverFactory.prototype.attach = function attach(vmId) {
        const self = this;
        return OvhApiCloudProjectIpFailover.v6()
          .attach(
            {
              serviceName: this.serviceName,
              id: this.id,
            },
            {
              instanceId: vmId,
            },
          )
          .$promise.then((ipOptions) => {
            self.status = ipOptions.status;
          });
      };

      /**
       * Detach an IP from a vm
       */
      IpFailoverFactory.prototype.detach = function detach() {
        const self = this;
        return OvhApiCloudProjectIpFailover.v6()
          .detach(
            {
              serviceName: this.serviceName,
              id: this.id,
            },
            {},
          )
          .$promise.then((ipOptions) => {
            self.status = ipOptions.status;
          });
      };

      /**
       * Park the IP
       */
      IpFailoverFactory.prototype.park = function park() {
        const self = this;
        return OvhApiIpReverse.v6()
          .park(
            {
              ip: this.ip,
            },
            {},
          )
          .$promise.then((ipOptions) => {
            self.status = ipOptions.status;
          });
      };

      /**
       *  Prepare object to json encode function to avoid function being encoded.
       */
      IpFailoverFactory.prototype.prepareToJson = function prepareToJson() {
        return {
          id: this.id,
          type: this.type,
        };
      };

      return IpFailoverFactory;
    },
  );
