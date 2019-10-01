/**
 *  @ngdoc service
 *  @name managerApp.service:tucVoipLineFeature
 *
 *  @requires managerApp.service:tucVoipLine
 *  @requires managerApp.service:tucVoipFax
 *  @requires OvhApiTelephony from ovh-api-services
 *
 *  @description
 *  <p>Service that manage features of services with serviceType line.
 *    This is not the line feature that is managed (the line service type either) !!!</p>
 *  <p>This service will manage API calls to `/telephony/{billingAccount}/line/{serviceName}`
 *    and `/telephony/{billingAccount}/fax/{serviceName}`</p>
 */
export default class {
  /* @ngInject */
  constructor(tucVoipLine, tucVoipFax, OvhApiTelephony) {
    this.tucVoipLine = tucVoipLine;
    this.tucVoipFax = tucVoipFax;
    this.OvhApiTelephony = OvhApiTelephony;
  }

  /**
   *  @ngdoc method
   *  @name managerApp.service:tucVoipLineFeature#fetchFeature
   *  @methodOf managerApp.service:tucVoipLineFeature
   *
   *  @description
   *  Fetch feature from a service. Will let the good sub-service (`tucVoipLine` or `tucVoipFax`)
   *  managing the good API call.
   *
   *  @param {TucVoipService} service    A `TucVoipService` instance.
   *
   *  @return {Promise}   That return a `TucVoipFeature` instance.
   */
  fetchFeature(service) {
    // first check featureType of the service
    if (this.constructor.isFax(service.featureType)) {
      // if fax or freefax - let the fax service fetch the feature
      return this.tucVoipFax.fetchFeature(service);
    }

    // otherwise let the line service fetch the feature
    return this.tucVoipLine.fetchFeature(service);
  }

  /**
   *  @ngdoc method
   *  @name managerApp.service:tucVoipLineFeature#saveFeature
   *  @methodOf managerApp.service:tucVoipLineFeature
   *
   *  @description
   *  Save a feature by letting the good sub-service (`tucVoipLine` or `tucVoipFax`)
   *  managing the good API call.
   *
   *  @param {TucVoipFeature}    feature    The `TucVoipFeature` instance to save.
   *  @param {Object}         options    The new options of the `TucVoipFeature` instance.
   *
   *  @return {Promise}   That return the `TucVoipFeature` instance with saved value.
   */
  saveFeature(feature, options) {
    // first check featureType of the service
    if (this.constructor.isFax(feature.featureType)) {
      // if fax or freefax - let the fax service save the feature
      return this.tucVoipFax.saveFeature(feature, options);
    }

    // otherwise let the line service save the feature
    return this.tucVoipLine.saveFeature(feature, options);
  }

  /**
   *  @ngdoc method
   *  @name managerApp.service:tucVoipLineFeature#isFax
   *  @methodOf managerApp.service:tucVoipLineFeature
   *
   *  @description
   *  Determine if the given feature type is fax type (and so managed by /fax API routes).
   *
   *  @param  {String}  featureType The feature type to check.
   *
   *  @return {Boolean}   `true` if featureType is considered as fax.
   */
  static isFax(featureType) {
    return ['fax', 'freefax'].indexOf(featureType) > -1;
  }
}
