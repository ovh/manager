import filter from 'lodash/filter';
import get from 'lodash/get';
import head from 'lodash/head';
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';
import map from 'lodash/map';
import some from 'lodash/some';

export default /* @ngInject */ ($q, OvhApiTelephony) => {
  /*= ==================================
    =            CONSTRUCTOR            =
    =================================== */

  function TelephonyGroupFax(optionsParam) {
    let options = optionsParam;

    if (!options) {
      options = {};
    }

    // options check
    if (!options.billingAccount) {
      throw new Error(
        'billingAccount option must be specified when creating a new TelephonyGroupFax',
      );
    }

    if (!options.serviceName) {
      throw new Error(
        'serviceName option must be specified when creating a new TelephonyGroupFax',
      );
    }

    // mandatory
    this.billingAccount = options.billingAccount;
    this.serviceName = options.serviceName;

    // from API
    this.serviceType = options.serviceType;
    this.description = options.description;
    this.offers = options.offers;

    // managing notifications object
    this.notifications = options.notifications || {};
    if (
      isNull(get(this.notifications, 'logs')) ||
      isUndefined(get(this.notifications, 'logs'))
    ) {
      this.notifications.logs = {
        email: null,
        frequency: 'Never',
        sendIfNull: false,
      };
    }

    // custom attributes
    this.inEdition = false;
    this.saveForEdition = null;
    this.isFax = true;

    // helper
    this.isSip = some(
      this.offers,
      (offer) => angular.isString(offer) && offer.indexOf('sipfax') >= 0,
    );
  }

  /* -----  End of CONSTRUCTOR  ------*/

  /*= ========================================
    =            PROTOTYPE METHODS            =
    ========================================= */

  TelephonyGroupFax.prototype.getDisplayedName = function getDisplayedName() {
    const self = this;

    return self.description || self.serviceName;
  };

  /* ----------  API CALLS  ----------*/

  TelephonyGroupFax.prototype.save = function save() {
    const self = this;

    return OvhApiTelephony.Fax()
      .v6()
      .edit(
        {
          billingAccount: self.billingAccount,
          serviceName: self.serviceName,
        },
        {
          description: self.description,
          notifications: self.notifications,
        },
      ).$promise;
  };

  TelephonyGroupFax.prototype.terminate = function terminate(reason, details) {
    const self = this;

    return OvhApiTelephony.Service()
      .v6()
      .delete(
        {
          billingAccount: self.billingAccount,
          serviceName: self.serviceName,
        },
        {
          reason,
          details,
        },
      ).$promise;
  };

  TelephonyGroupFax.prototype.cancelTermination = function cancelTermination() {
    const self = this;

    return OvhApiTelephony.Service()
      .v6()
      .cancelTermination(
        {
          billingAccount: self.billingAccount,
          serviceName: self.serviceName,
        },
        {},
      ).$promise;
  };

  /* ----------  TASK  ----------*/

  TelephonyGroupFax.prototype.getTerminationTask = function getTerminationTask() {
    const self = this;

    return OvhApiTelephony.Service()
      .OfferTask()
      .v6()
      .query({
        billingAccount: self.billingAccount,
        serviceName: self.serviceName,
        action: 'termination',
        type: 'offer',
      })
      .$promise.then((offerTaskIds) =>
        $q
          .all(
            map(
              offerTaskIds,
              (id) =>
                OvhApiTelephony.Service()
                  .OfferTask()
                  .v6()
                  .get({
                    billingAccount: self.billingAccount,
                    serviceName: self.serviceName,
                    taskId: id,
                  }).$promise,
            ),
          )
          .then((tasks) => head(filter(tasks, { status: 'todo' }))),
      );
  };

  /* ----------  EDITION  ----------*/

  TelephonyGroupFax.prototype.startEdition = function startEdition() {
    const self = this;

    self.inEdition = true;

    self.saveForEdition = {
      description: angular.copy(self.description),
      notifications: angular.copy(self.notifications),
    };

    return self;
  };

  TelephonyGroupFax.prototype.stopEdition = function stopEdition(cancel) {
    const self = this;

    if (self.saveForEdition && cancel) {
      self.description = angular.copy(self.saveForEdition.description);
      self.notifications = angular.copy(self.saveForEdition.notifications);
    }

    self.saveForEdition = null;
    self.inEdition = false;

    return self;
  };

  TelephonyGroupFax.prototype.hasChange = function hasChange(path) {
    const self = this;

    return get(self.saveForEdition, path) !== get(self, path);
  };

  /* -----  End of PROTOTYPE METHODS  ------*/

  return TelephonyGroupFax;
};
