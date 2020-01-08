import angular from 'angular';
import set from 'lodash/set';

/**
 *  @ngdoc service
 *  @name managerApp.service:tucVoipFax
 *
 *  @requires OvhApiTelephony from ovh-api-services
 *  @requires managerApp.object:TucVoipLineFeature
 *
 *  @description
 *  <p>Describe a service that manage fax and freefax feature types.</p>
 *  <p>This service will manage API calls to `/telephony/{billingAccount}/fax/{serviceName}` (see {@link https://eu.api.ovh.com/console/#/telephony/%7BbillingAccount%7D/fax#GET telephony fax APIs})</p>
 */
export default class {
  /* @ngInject */
  constructor(OvhApiTelephony, TucVoipLineFeature) {
    this.OvhApiTelephony = OvhApiTelephony;
    this.TucVoipLineFeature = TucVoipLineFeature;
  }

  /**
   *  @ngdoc method
   *  @name managerApp.service:tucVoipFax#fetchFeature
   *  @methodOf managerApp.service:tucVoipFax
   *
   *  @description
   *  <p>Fetch a fax feature from a service.</p>
   *  <p>Manage call to `GET /telephony/{billingAccount}/fax/{serviceName}`.</p>
   *
   *  @param {TucVoipService} service    A `TucVoipService` instance.
   *
   *  @return {Promise}   That return a `TucVoipLineFeature` instance.
   */
  fetchFeature(service) {
    return this.OvhApiTelephony.Fax()
      .v6()
      .get({
        billingAccount: service.billingAccount,
        serviceName: service.serviceName,
      })
      .$promise.then((featureOptions) => {
        // create an instance of the feature with it's options
        const feature = new this.TucVoipLineFeature(
          angular.extend(featureOptions, {
            billingAccount: service.billingAccount,
            featureType: service.featureType,
          }),
        );

        // set service feature with TucVoipLineFeature instance previously created
        set(service, 'feature', feature);

        return service.feature;
      });
  }

  /**
   *  @ngdoc method
   *  @name managerApp.service:tucVoipFax#saveFeature
   *  @methodOf managerApp.service:tucVoipFax
   *
   *  @description
   *  <p>Save a fax feature.</p>
   *  <p>Manage call to `PUT /telephony/{billingAccount}/fax/{serviceName}`.</p>
   *
   *  @param {TucVoipLineFeature}    feature    The `TucVoipLineFeature` instance to save.
   *  @param {Object}             options    The new options of the `TucVoipLineFeature` instance.
   *
   *  @return {Promise}   That return the `TucVoipLineFeature` instance with saved value.
   */
  saveFeature(feature, featureOptions) {
    return this.OvhApiTelephony.Fax()
      .v6()
      .edit(
        {
          billingAccount: feature.billingAccount,
          serviceName: feature.serviceName,
        },
        featureOptions,
      )
      .$promise.then(() => {
        // set the new options saved
        feature.setOptions(featureOptions);
      });
  }
}
