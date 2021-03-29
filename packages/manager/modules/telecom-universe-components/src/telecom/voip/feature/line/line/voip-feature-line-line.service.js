import angular from 'angular';
import set from 'lodash/set';

/**
 *  @ngdoc service
 *  @name managerApp.service:tucVoipLine
 *
 *  @requires OvhApiTelephony from ovh-api-services
 *  @requires managerApp.object:TucVoipLine
 *
 *  @description
 *  <p>Describe a service that manage sip, mgcp, plugAndFax,… feature types
 *    (all featureTypes that are not fax and freefax for line services).</p>
 *  <p>This service will manage API calls to `/telephony/{billingAccount}/line/{serviceName}`
 *    (see {@link https://eu.api.ovh.com/console/#/telephony/%7BbillingAccount%7D/line#GET telephony line APIs})</p>
 */
export default class {
  /* @ngInject */
  constructor(OvhApiTelephony, TucVoipLine) {
    this.OvhApiTelephony = OvhApiTelephony;
    this.TucVoipLine = TucVoipLine;
  }

  /**
   *  @ngdoc method
   *  @name managerApp.service:tucVoipLine#fetchFeature
   *  @methodOf managerApp.service:tucVoipLine
   *
   *  @description
   *  <p>Fetch a line feature from a service.</p>
   *  <p>Manage call to `GET /telephony/{billingAccount}/line/{serviceName}`.</p>
   *
   *  @param {TucVoipService} service    A `TucVoipService` instance.
   *
   *  @return {Promise}   That return a `TucVoipLine` instance.
   */
  fetchFeature(service) {
    return this.OvhApiTelephony.Line()
      .v6()
      .get({
        billingAccount: service.billingAccount,
        serviceName: service.serviceName,
      })
      .$promise.then((featureOptions) => {
        // create an instance of the feature with it's options
        const feature = new this.TucVoipLine(
          angular.extend(featureOptions, {
            billingAccount: service.billingAccount,
            featureType: service.featureType,
          }),
        );

        // set service feature with TucVoipLine instance previously created
        set(service, 'feature', feature);

        return service.feature;
      });
  }

  /**
   *  @ngdoc method
   *  @name managerApp.service:tucVoipLine#fetchLineInfo
   *  @methodOf managerApp.service:tucVoipLine
   *
   *  @description
   *  <p>Fetch a line info from a service.</p>
   *  <p>Manage call to `GET /telephony/{billingAccount}/line`.</p>
   *
   *  @param {TucVoipService} service    A `TucVoipService` instance.
   *
   *  @return {Promise}   That return a `TucVoipLine` instance.
   */
  fetchLineInfo(service) {
    return this.OvhApiTelephony.Line().v6().get({
      billingAccount: service.billingAccount,
      serviceName: service.serviceName,
    }).$promise;
  }

  /**
   *  @ngdoc method
   *  @name managerApp.service:tucVoipLine#saveFeature
   *  @methodOf managerApp.service:tucVoipLine
   *
   *  @description
   *  <p>Save a line feature.</p>
   *  <p>Manage call to `PUT /telephony/{billingAccount}/line/{serviceName}`.</p>
   *
   *  @param {TucVoipLine}   feature    The `TucVoipLine` instance to save.
   *  @param {Object}     options    The new options of the `TucVoipLine` instance.
   *
   *  @return {Promise}   That return the `TucVoipLine` instance with saved value.
   */
  saveFeature(feature, featureOptions) {
    return this.OvhApiTelephony.Line()
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
