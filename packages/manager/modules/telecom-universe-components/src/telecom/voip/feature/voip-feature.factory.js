/**
 *  @ngdoc object
 *  @name managerApp.object:TucVoipFeature
 *
 *  @description
 *  <p>Factory that describes a voip feature (e.g. sip, mgcp, contactCenterSolution,…).
 *    This is a base for {@link managerApp.object:TucVoipLineFeature TucVoipLineFeature factory}
 *    and future VoipAliasFeature factory.</p>
 *  <p>Should not directly instanciated.</p>
 *
 *  @constructor
 *  @param {Object} options                 Shared (required) options
 *                                          for creating a new `TucVoipFeature` instance.
 *  @param {String} options.billingAccount  The billing account of the feature.
 *  @param {String} options.serviceName     The service name of the service linked to the feature.
 *  @param {String} options.featureType     The type of the feature
 *                                          (sip, mgcp, contactCenterSolution, …).
 */
export default /* @ngInject */ () => {
  const mandatoryOptions = ['billingAccount', 'serviceName', 'featureType'];

  class TucVoipFeature {
    constructor(options = {}) {
      // check for mandatory options
      mandatoryOptions.forEach((option) => {
        if (!options[option]) {
          throw new Error(
            `${option} option must be specified when creating a new TucVoipFeature`,
          );
        }
      });

      // populate object attributes
      // mandatory attribute
      this.billingAccount = options.billingAccount;
      this.serviceName = options.serviceName;
      this.featureType = options.featureType;
    }
  }

  return TucVoipFeature;
};
