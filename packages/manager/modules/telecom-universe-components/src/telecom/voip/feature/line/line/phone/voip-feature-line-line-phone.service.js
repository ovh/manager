import angular from 'angular';

/**
 *  @ngdoc service
 *  @name managerApp.service:tucVoipLinePhone
 *
 *  @description
 *  <p>Service that manage phone linked to sip and mgcp features of services
 *    with serviceType line.</p>
 *  <p>This service will manage API calls to
 *    `/telephony/{billingAccount}/line/{serviceName}/phone`</p>
 */
export default class {
  /* @ngInject */
  constructor(TucVoipLinePhone, tucVoipService, OvhApiTelephony) {
    this.TucVoipLinePhone = TucVoipLinePhone;
    this.tucVoipService = tucVoipService;
    this.OvhApiTelephony = OvhApiTelephony;
  }

  /**
   *  @ngdoc method
   *  @name managerApp.service:tucVoipLinePhone#fetchAll
   *  @methodOf managerApp.service:tucVoipLinePhone
   *
   *  @description
   *  Fetch all phone of all services of serviceType line with featureType sip
   *  or mgcp from any billingAccount. This use APIv7 with wildcard and aggregation to achieve it.
   *
   *  @return {Promise}   That return an array of TucVoipLinePhone instances.
   */
  fetchAll() {
    return this.OvhApiTelephony.Line()
      .Phone()
      .v7()
      .query()
      .aggregate('billingAccount')
      .aggregate('serviceName')
      .expand()
      .execute()
      .$promise.then((results) => {
        const phoneList = [];

        results.forEach((result) => {
          // first retrieve billingAccount and serviceName from path
          const splittedPath = result.path.split('/');

          // extend phone options
          const phoneOptions = angular.extend(result.value, {
            billingAccount: splittedPath[2],
            serviceName: splittedPath[4],
          });

          phoneList.push(new this.TucVoipLinePhone(phoneOptions));
        });

        return phoneList;
      });
  }
}
