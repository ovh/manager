import angular from 'angular';
import chunk from 'lodash/chunk';
import filter from 'lodash/filter';
import flatten from 'lodash/flatten';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import head from 'lodash/head';
import map from 'lodash/map';
import set from 'lodash/set';

import { FEATURE_TYPES } from './voip-service.constants';

/**
 *  @ngdoc service
 *  @name managerApp.service:tucVoipService
 *
 *  @requires $q provider
 *  @requires OvhApiTelephony from ovh-api-services
 *  @requires managerApp.object:TucVoipService
 *  @requires managerApp.object:TucVoipServiceAlias
 *  @requires managerApp.object:TucVoipServiceLine
 *
 *  @description
 *  Service that manage API calls to `/telephony/{billingAccount}/service/{serviceName}`.
 *  It will differenciate alias and line service types.
 */
export default class {
  /* @ngInject */
  constructor(
    $q,
    iceberg,
    OvhApiTelephony,
    TucVoipService,
    TucVoipServiceAlias,
    TucVoipServiceLine,
  ) {
    this.$q = $q;
    this.iceberg = iceberg;
    this.OvhApiTelephony = OvhApiTelephony;
    this.TucVoipService = TucVoipService;
    this.TucVoipServiceAlias = TucVoipServiceAlias;
    this.TucVoipServiceLine = TucVoipServiceLine;
  }

  /**
   *  @ngdoc method
   *  @name managerApp.service:tucVoipService#fetchAll
   *  @methodOf managerApp.service:tucVoipService
   *
   *  @description
   *  Get all the service of one billingAccount.
   *
   *  @param {String} billingAccount The billingAccount to which is attached the services.
   *
   *  @return {Promise} That return an Array of TucVoipService instances.
   */
  fetchAll(billingAccount) {
    return this.iceberg(`/telephony/${billingAccount}/service`)
      .query()
      .expand('CachedObjectList-Pages')
      .execute(null, true)
      .$promise.then(({ data: services }) =>
        services.map((service) =>
          this.constructService({
            ...service,
            billingAccount,
          }),
        ),
      );
  }

  /**
   *  @ngdoc method
   *  @name managerApp.service:tucVoipService#fetchSingleService
   *  @methodOf managerApp.service:tucVoipService
   *
   *  @description
   *  <p>Use API to get single service of given billingAccount and serviceName.</p>
   *  <p>Make a call to *GET* `/telephony/{billingAccount}/service/{serviceName}` API route.</p>
   *
   *  @param  {String} billingAccount The billingAccount to which is attached the service.
   *  @param  {String} serviceName    The unique id of the service.
   *
   *  @return {Promise}   That returns a TucVoipService instance representing the fetched service.
   */
  fetchSingleService(billingAccount, serviceName) {
    return this.OvhApiTelephony.Service()
      .v6()
      .get({
        billingAccount,
        serviceName,
      })
      .$promise.then((result) => {
        // ensure billingAccount is setted
        set(result, 'billingAccount', billingAccount);
        return this.constructService(result);
      });
  }

  /* =========================================
    =            Diagnostic reports            =
    ========================================== */

  /**
   *  @ngdoc method
   *  @name managerApp.service:tucVoipService#fetchDiagnosticReports
   *  @methodOf managerApp.service:tucVoipService
   *
   *  @description
   *  <p>Use API to fetch relevant informations of the service detected from the MOS
   *    or the signal leg in SIP/MGCP protocol.</p>
   *  <p>Make a call to *GET* `/telephony/{billingAccount}/service/{serviceName}/diagnosticReports`
   *    API route.</p>
   *
   *  @param  {String} billingAccount The billingAccount to which is attached the service.
   *  @param  {String} serviceName    The unique id of the service.
   *  @param  {String} dayInterval    Number of days from now that you want to get report.
   *
   *  @return {Promise}   That returns an Array of {@link https://eu.api.ovh.com/console/#/telephony/%7BbillingAccount%7D/service/%7BserviceName%7D/diagnosticReports#GET `telephony.DiagnosticReport`} objects.
   */
  fetchDiagnosticReports(billingAccount, serviceName, dayInterval) {
    return this.OvhApiTelephony.Service()
      .v6()
      .diagnosticReports({
        billingAccount,
        serviceName,
        dayInterval,
      }).$promise;
  }

  /**
   *  @ngdoc method
   *  @name managerApp.service:tucVoipService#fetchServiceDiagnosticReports
   *  @methodOf managerApp.service:tucVoipService
   *
   *  @description
   *  <p>Same as `fetchDiagnosticReports` but taking in argument a TucVoipService instance.</p>
   *
   *  @param  {TucVoipService} service   The TucVoipService instance you want to fetch
   *                                     diagnostic reports.
   *  @param  {String} dayInterval    Number of days from now that you want to get report.
   *
   *  @return {Promise}   That returns an Array of {@link http://jean-baptiste.devs.ria.ovh.net/rico/#/telephony/%7BbillingAccount%7D/service/%7BserviceName%7D/diagnosticReports#GET `telephony.DiagnosticReport`} objects.
   */
  fetchServiceDiagnosticReports(service, dayInterval) {
    return this.fetchDiagnosticReports(
      service.billingAccount,
      service.serviceName,
      dayInterval,
    );
  }

  /* -----  End of Diagnostic reports  ------ */

  /**
   *  @ngdoc method
   *  @name managerApp.service:tucVoipService#getTerminationTask
   *  @methodOf managerApp.service:tucVoipService
   *
   *  @description
   *  <p>Get pending termination task for a given service.</p>
   *
   *  @param  {VoipService} service   The given VoipService.
   *
   *  @return {Object}   the pending termination task
   */
  getTerminationTask(service) {
    return this.OvhApiTelephony.Service()
      .OfferTask()
      .v6()
      .query({
        billingAccount: service.billingAccount,
        serviceName: service.serviceName,
        action: 'termination',
        type: 'offer',
      })
      .$promise.then((offerTaskIds) =>
        this.$q
          .all(
            map(
              offerTaskIds,
              (id) =>
                this.OvhApiTelephony.Service()
                  .OfferTask()
                  .v6()
                  .get({
                    billingAccount: service.billingAccount,
                    serviceName: service.serviceName,
                    taskId: id,
                  }).$promise,
            ),
          )
          .then((tasks) => head(filter(tasks, { status: 'todo' }))),
      );
  }

  /**
   *  @ngdoc method
   *  @name managerApp.service:tucVoipService#getServiceDirectory
   *  @methodOf managerApp.service:tucVoipService
   *
   *  @description
   *  <p>Get directory for a given service.</p>
   *
   *  @param  {VoipService} service   The given VoipService.
   *
   *  @return {Promise}  Promise that returns directory
   */
  getServiceDirectory(service) {
    return this.OvhApiTelephony.Service()
      .v6()
      .directory({
        billingAccount: service.billingAccount,
        serviceName: service.serviceName,
      }).$promise;
  }

  /**
   *  @ngdoc method
   *  @name managerApp.service:tucVoipService#getServiceConsumption
   *  @methodOf managerApp.service:tucVoipService
   *
   *  @description
   *  <p>Get consumption of a given service.</p>
   *
   *  @param  {VoipService} service The given VoipService service.
   *
   *  @return {Array}               Consumption list of details
   */
  getServiceConsumption(service) {
    return this.OvhApiTelephony.Service()
      .VoiceConsumption()
      .v6()
      .query({
        billingAccount: service.billingAccount,
        serviceName: service.serviceName,
      })
      .$promise.then((ids) =>
        this.$q
          .all(
            map(
              chunk(ids, 50),
              (chunkIds) =>
                this.OvhApiTelephony.Service()
                  .VoiceConsumption()
                  .v6()
                  .getBatch({
                    billingAccount: service.billingAccount,
                    serviceName: service.serviceName,
                    consumptionId: chunkIds,
                  }).$promise,
            ),
          )
          .then((chunkResult) => flatten(chunkResult)),
      )
      .then((result) => map(result, 'value'));
  }

  /**
   *  @ngdoc method
   *  @name managerApp.service:tucVoipService#fetchServiceRepayments
   *  @methodOf managerApp.service:tucVoipService
   *
   *  @description
   *  <p>Fetch repayments of a given service.</p>
   *
   *  @param  {VoipService} service The given VoipService service.
   *
   *  @return {Array}               Repayments list
   */
  fetchServiceRepayments({ billingAccount, serviceName }) {
    return this.OvhApiTelephony.Service()
      .RepaymentConsumption()
      .v6()
      .query({
        billingAccount,
        serviceName,
      })
      .$promise.then((repaymentsIds) =>
        this.$q.all(
          repaymentsIds.map(
            (repayment) =>
              this.OvhApiTelephony.Service()
                .RepaymentConsumption()
                .v6()
                .get({
                  billingAccount,
                  serviceName,
                  consumptionId: repayment,
                }).$promise,
          ),
        ),
      );
  }

  /* ==============================
    =            Filters            =
    =============================== */

  static groupByFeatureType(services) {
    return groupBy(services, (service) =>
      get(
        FEATURE_TYPES.GROUPS,
        service.featureType,
        FEATURE_TYPES.DEFAULT_GROUP,
      ),
    );
  }

  /* ----------  By service type  ---------- */

  /**
   *  @ngdoc method
   *  @name managerApp.service:tucVoipService#filterAliasServices
   *  @methodOf managerApp.service:tucVoipService
   *
   *  @description
   *  Filter the services of given services list that match alias serviceType.
   *
   *  @param  {Array.<VoipSercice>} services The services list to filter.
   *
   *  @return {Array.<VoipSercice>} The filtered list of aliases.
   */
  static filterAliasServices(services) {
    return filter(services, {
      serviceType: 'alias',
    });
  }

  /**
   *  @ngdoc method
   *  @name managerApp.service:tucVoipService#filterLineServices
   *  @methodOf managerApp.service:tucVoipService
   *
   *  @description
   *  Filter the services of given services list that match line serviceType.
   *
   *  @param  {Array.<VoipSercice>} services The services list to filter.
   *
   *  @return {Array.<VoipSercice>} The filtered list of lines.
   */
  static filterLineServices(services) {
    return filter(services, {
      serviceType: 'line',
    });
  }

  /* ----------  By feature type  ---------- */

  /**
   *  @ngdoc method
   *  @name managerApp.service:tucVoipService#filterPlugAndFaxServices
   *  @methodOf managerApp.service:tucVoipService
   *
   *  @description
   *  Filter the services of given services list that match plugAndFax featureType.
   *
   *  @param  {Array.<VoipSercice>} services The services list to filter.
   *
   *  @return {Array.<VoipSercice>} The filtered list of plugAndFax.
   */
  static filterPlugAndFaxServices(services) {
    return filter(services, {
      featureType: 'plugAndFax',
    });
  }

  /**
   *  @ngdoc method
   *  @name managerApp.service:tucVoipService#filterFaxServices
   *  @methodOf managerApp.service:tucVoipService
   *
   *  @description
   *  Filter the services of given services list that match fax featureType.
   *
   *  @param  {Array.<VoipSercice>} services The services list to filter.
   *
   *  @return {Array.<VoipSercice>} The filtered list of fax.
   */
  static filterFaxServices(services) {
    return filter(
      services,
      (service) => ['fax', 'voicefax'].indexOf(service.featureType) > -1,
    );
  }

  /* -----  End of Filters  ------ */

  /**
   *  @ngdoc method
   *  @name managerApp.service:tucVoipService#sortServicesByDisplayedName
   *  @methodOf managerApp.service:tucVoipService
   *
   *  @description
   *  Sort given services list by displayed name.
   *
   *  @param  {Array.<VoipSercice>} services List of services to be sorted.
   *
   *  @return {Array.<VoipSercice>}   The sorted list of services.
   */
  static sortServicesByDisplayedName(services) {
    return angular
      .copy(services)
      .sort((first, second) =>
        first.getDisplayedName().localeCompare(second.getDisplayedName()),
      );
  }

  /* ==============================
  =            Private            =
  =============================== */

  /**
   *  @description
   *  Construct the good service type instance from the serviceTypeOptions.
   *  An error is throwned if the serviceType is not supported.
   *
   *  @private
   *
   *  @param  {Object} options The options needed for creating a new TucVoipService instance
   *                           (see TucVoipService constructor for more details).
   *  @return {TucVoipService}    The good instance type of TucVoipService.
   */
  constructService(options) {
    switch (options.serviceType) {
      case 'alias':
        return new this.TucVoipServiceAlias(options);
      case 'line':
        return new this.TucVoipServiceLine(options);
      default:
        throw new Error(`${options.serviceType} serviceType is not supported`);
    }
  }

  /* -----  End of Private  ------ */
}
