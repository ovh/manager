import flatten from 'lodash/flatten';

angular
  .module('managerApp')
  .factory('CloudProjectComputeInfraIpPublicFactory', () => {
    /**
     *  Defines a cloud project compute infrastructure Public IP
     *
     *  /!\ Take care when modifying this!!! Check setInfos, and prepareToJson too.
     */
    const IpPublicFactory = (function IpPublicFactory() {
      return function CloudProjectComputeInfraIpPublicFactory(optionsParam) {
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
    IpPublicFactory.prototype.getCustomOptions = function getCustomOptions(
      options,
    ) {
      return angular.extend(options, {
        type: 'public',
        routedTo: options.routedTo ? flatten([options.routedTo]) : [], // Ensure routedTo is always an array
      });
    };

    /**
     *  Set infos after initialization
     */
    IpPublicFactory.prototype.setInfos = function setInfos(optionsParam) {
      let options = optionsParam;

      // Set custom values
      options = this.getCustomOptions(options || {});

      // Ok now extend it
      angular.extend(this, options);

      return this;
    };

    /**
     *  Prepare object to json encode function to avoid function being encoded.
     */
    IpPublicFactory.prototype.prepareToJson = function prepareToJson() {
      return {
        id: this.id,
        type: this.type,
      };
    };

    return IpPublicFactory;
  });
