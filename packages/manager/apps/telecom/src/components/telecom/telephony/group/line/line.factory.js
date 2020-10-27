import endsWith from 'lodash/endsWith';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import indexOf from 'lodash/indexOf';
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';
import map from 'lodash/map';
import remove from 'lodash/remove';
import set from 'lodash/set';
import some from 'lodash/some';
import startsWith from 'lodash/startsWith';
import sortBy from 'lodash/sortBy';

export default /* @ngInject */ (
  $q,
  $filter,
  OvhApiTelephony,
  OvhApiPackXdslVoipLine,
  VoipScheduler,
  VoipTimeCondition,
  TelephonyGroupLinePhone,
  TelephonyGroupLineClick2Call,
  TelephonyGroupLineOffer,
  VoipLineOldOffers,
) => {
  /*= ==================================
    =            CONSTRUCTOR            =
    =================================== */

  function TelephonyGroupLine(optionsParam) {
    let options = optionsParam;

    if (!options) {
      options = {};
    }

    // options check
    if (!options.billingAccount) {
      throw new Error(
        'billingAccount option must be specified when creating a new TelephonyGroupLine',
      );
    }

    if (!options.serviceName) {
      throw new Error(
        'serviceName option must be specified when creating a new TelephonyGroupLine',
      );
    }

    // mandatory
    this.billingAccount = options.billingAccount;
    this.serviceName = options.serviceName;

    // from API
    this.serviceType = options.serviceType;
    this.description = options.description;

    this.infrastructure = options.infrastructure;
    this.offers = options.offers || [];
    this.getPublicOffer = options.getPublicOffer;
    this.simultaneousLines = options.simultaneousLines;
    this.phone = options.phone;
    this.hasPhone = undefined;
    this.hasSupportsPhonebook = undefined;

    this.options = null;
    this.ips = null;
    this.lastRegistrations = null;

    // Waiting API, next bill is always first day of next month
    this.nextBill =
      options.nextBill ||
      moment([moment().year(), moment().month(), 1])
        .add(1, 'M')
        .valueOf();

    // managing notifications object
    this.notifications = options.notifications;
    if (isNull(get(this.notifications, 'logs'))) {
      this.notifications.logs = {
        email: null,
        frequency: 'Never',
        sendIfNull: false,
      };
    }

    // custom attributes
    this.inEdition = false;
    this.saveForEdition = null;

    this.offerInformations = null;
    this.pendingOfferChange = null;

    this.scheduler = null;
    this.timeCondition = null;

    this.availableCodecs = null;

    // helper
    this.isPlugNFax = some(
      this.offers,
      (offer) =>
        angular.isString(offer) &&
        (offer.indexOf('fax') >= 0 ||
          some(
            VoipLineOldOffers.oldOffers.sipNFax,
            (old) => offer.indexOf(old) > -1,
          )),
    );
  }

  /* -----  End of CONSTRUCTOR  ------*/

  /*= ========================================
    =            PROTOTYPE METHODS            =
    ========================================= */

  TelephonyGroupLine.prototype.getDisplayedName = function getDisplayedName() {
    const self = this;

    return self.description || self.serviceName;
  };

  TelephonyGroupLine.prototype.getOffers = function getOffers(params) {
    return OvhApiTelephony.Line()
      .Offers()
      .v6()
      .query(params).$promise;
  };

  TelephonyGroupLine.prototype.getOfferPhones = function getOfferPhones(
    params,
  ) {
    return OvhApiTelephony.Line()
      .Offers()
      .v6()
      .phones(params).$promise;
  };

  TelephonyGroupLine.prototype.getOfferTypes = function getOfferTypes() {
    return map(this.offers, (offer) => {
      const cleaned = offer.replace(/^voip\.main\.offer\./, '').split('.');
      return cleaned[0];
    });
  };

  TelephonyGroupLine.prototype.isOffer = function isOffer(name) {
    const offerPrefix = `voip.main.offer.${name}`;
    return some(this.offers, (offer) => startsWith(offer, offerPrefix));
  };

  TelephonyGroupLine.prototype.isIndividual = function isIndividual() {
    return this.isOffer('individual');
  };

  TelephonyGroupLine.prototype.isSipfax = function isSipfax() {
    return this.isOffer('sipfax');
  };

  TelephonyGroupLine.prototype.isVoicefax = function isVoicefax() {
    return (
      get(this, 'getPublicOffer.name') === 'voicefax' ||
      this.isOffer('voicefax')
    );
  };

  TelephonyGroupLine.prototype.isPriceplan = function isPriceplan() {
    return this.isOffer('priceplan');
  };

  TelephonyGroupLine.prototype.isTrunk = function isTrunk() {
    return (
      get(this, 'getPublicOffer.name') === 'trunk' || this.isOffer('trunk')
    );
  };

  /* ----------  API CALLS  ----------*/

  TelephonyGroupLine.prototype.save = function save() {
    const self = this;

    return OvhApiTelephony.Line()
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

  TelephonyGroupLine.prototype.supportsPhonebook = function supportsPhonebook() {
    const self = this;

    if (isUndefined(self.hasSupportsPhonebook)) {
      return OvhApiTelephony.Line()
        .Phone()
        .v6()
        .supportsPhonebook({
          billingAccount: self.billingAccount,
          serviceName: self.serviceName,
        })
        .$promise.then(
          (support) => {
            self.hasSupportsPhonebook = get(support, 'data', null);
            return support;
          },
          () => {
            self.hasSupportsPhonebook = false;
            return null;
          },
        );
    }
    return $q.when(self.hasSupportsPhonebook);
  };

  TelephonyGroupLine.prototype.getPhone = function getPhone() {
    const self = this;

    if (!self.phone && isUndefined(self.hasPhone)) {
      return OvhApiTelephony.Line()
        .Phone()
        .v6()
        .get({
          billingAccount: self.billingAccount,
          serviceName: self.serviceName,
        })
        .$promise.then(
          (phoneOpts) => {
            self.phone = new TelephonyGroupLinePhone(
              {
                billingAccount: self.billingAccount,
                serviceName: self.serviceName,
              },
              phoneOpts,
            );

            self.hasPhone = true;

            return self.phone;
          },
          () => {
            self.hasPhone = false;
            return null;
          },
        );
    }
    return $q.when(self.phone);
  };

  TelephonyGroupLine.prototype.getClick2Call = function getClick2Call() {
    const self = this;

    self.click2Call = new TelephonyGroupLineClick2Call({
      billingAccount: self.billingAccount,
      serviceName: self.serviceName,
    });

    return self.click2Call;
  };

  TelephonyGroupLine.prototype.getAvailableTerminationReasons = function getAvailableTerminationReasons() {
    return OvhApiTelephony.Line()
      .v6()
      .schema()
      .$promise.then((schema) => schema);
  };

  TelephonyGroupLine.prototype.hasPendingOfferTasks = function hasPendingOfferTasks() {
    const self = this;

    return OvhApiTelephony.Service()
      .OfferTask()
      .v6()
      .query({
        billingAccount: self.billingAccount,
        serviceName: self.serviceName,
      })
      .$promise.then((taskIds) =>
        $q.all(
          map(
            taskIds,
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
        ),
      )
      .then(
        (tasks) =>
          filter(
            tasks,
            (task) =>
              task.status === 'todo' ||
              task.status === 'doing' ||
              task.status === 'pause',
          ).length > 0,
      );
  };

  TelephonyGroupLine.prototype.getTerminating = function getTerminating() {
    const self = this;

    return OvhApiTelephony.Service()
      .OfferTask()
      .v6()
      .query({
        billingAccount: self.billingAccount,
        serviceName: self.serviceName,
        action: 'termination',
        status: 'todo',
      })
      .$promise.then((tasks) => {
        if (tasks[0]) {
          return OvhApiTelephony.Service()
            .OfferTask()
            .v6()
            .get({
              billingAccount: self.billingAccount,
              serviceName: self.serviceName,
              action: 'termination',
              status: 'todo',
              taskId: tasks[0],
            })
            .$promise.then((taskDetails) => {
              set(
                taskDetails,
                'executionDate',
                $filter('date')(taskDetails.executionDate, 'shortDate'),
              );
              return taskDetails;
            });
        }
        return null;
      });
  };

  // Get convert line to alias task
  TelephonyGroupLine.prototype.getConvertionTask = function getConvertionTask() {
    const self = this;

    return OvhApiTelephony.Service()
      .OfferTask()
      .v6()
      .query({
        billingAccount: self.billingAccount,
        serviceName: self.serviceName,
        action: 'convertToAlias',
        status: 'todo',
      })
      .$promise.then((tasks) => {
        if (tasks[0]) {
          return OvhApiTelephony.Service()
            .OfferTask()
            .v6()
            .get({
              billingAccount: self.billingAccount,
              serviceName: self.serviceName,
              action: 'convertToAlias',
              status: 'todo',
              taskId: tasks[0],
            }).$promise;
        }
        return null;
      });
  };

  /* Terminate/Resiliate Service */
  TelephonyGroupLine.prototype.terminate = function terminate(options) {
    const self = this;
    const params = {
      reason: options.id,
    };

    if (options.details) {
      params.details = options.details;
    }
    return OvhApiTelephony.Line()
      .v6()
      .terminate(
        {
          billingAccount: self.billingAccount,
          serviceName: self.serviceName,
        },
        params,
      ).$promise;
  };

  /* Cancel an Termination service */
  TelephonyGroupLine.prototype.cancelTermination = function cancelTermination() {
    const self = this;

    return OvhApiTelephony.Line()
      .v6()
      .cancelTermination({
        billingAccount: self.billingAccount,
        serviceName: self.serviceName,
      }).$promise;
  };

  TelephonyGroupLine.prototype.isIncludedInXdslPack = function isIncludedInXdslPack() {
    const self = this;

    return OvhApiPackXdslVoipLine.v7()
      .services()
      .aggregate('packName')
      .execute()
      .$promise.then((lines) => some(lines, { key: self.serviceName }));
  };

  /* ----------  OPTIONS  ----------*/

  TelephonyGroupLine.prototype.getOptions = function getOptions() {
    const self = this;

    if (!self.options) {
      return OvhApiTelephony.Line()
        .Options()
        .v6()
        .get({
          billingAccount: self.billingAccount,
          serviceName: self.serviceName,
        })
        .$promise.then((lineOptions) => {
          self.options = lineOptions;

          // if no codecs options - get the default
          if (self.options && !self.options.codecs) {
            return OvhApiTelephony.Line()
              .Options()
              .v6()
              .defaultCodecs({
                billingAccount: self.billingAccount,
                serviceName: self.serviceName,
              })
              .$promise.then((defaultCodecs) => {
                self.options.codecs = defaultCodecs.codecs;
                return self.options;
              });
          }
          return self.options;
        });
    }
    return $q.when(self.options);
  };

  TelephonyGroupLine.prototype.saveOption = function saveOption(
    optionName,
    optionValue,
  ) {
    const self = this;
    const lineOptions = {};

    lineOptions[optionName] = optionValue;

    return OvhApiTelephony.Line()
      .Options()
      .v6()
      .update(
        {
          billingAccount: self.billingAccount,
          serviceName: self.serviceName,
        },
        lineOptions,
      )
      .$promise.then(() => {
        self.options[optionName] = optionValue;
      });
  };

  /* ----------  CODECS  ----------*/

  TelephonyGroupLine.prototype.getAvailableCodecs = function getAvailableCodecs() {
    const self = this;

    return OvhApiTelephony.Line()
      .Options()
      .v6()
      .availableCodecs({
        billingAccount: self.billingAccount,
        serviceName: self.serviceName,
      })
      .$promise.then((codecsList) => {
        self.availableCodecs = sortBy(
          map(codecsList, (codec) => {
            if (!endsWith(codec, '_a')) {
              return {
                value: codec,
                automatic: indexOf(codecsList, `${codec}_a`) > -1,
              };
            }
            return null;
          }),
          (codec) => (codec && codec.value.length) || -1,
        );

        // remove null items (codecs that finish with _a)
        remove(self.availableCodecs, (codec) => isNull(codec));

        return self.availableCodecs;
      });
  };

  /* ----------  IPS  ----------*/

  TelephonyGroupLine.prototype.getIps = function getIps() {
    const self = this;

    return OvhApiTelephony.Line()
      .v6()
      .ips({
        billingAccount: self.billingAccount,
        serviceName: self.serviceName,
      })
      .$promise.then((ips) => {
        self.ips = ips;
        return self.ips;
      });
  };

  /* ----------  LAST REGISTRATIONS  ----------*/

  TelephonyGroupLine.prototype.getLastRegistrations = function getLastRegistrations() {
    const self = this;

    return OvhApiTelephony.Line()
      .v6()
      .lastRegistrations({
        billingAccount: self.billingAccount,
        serviceName: self.serviceName,
      })
      .$promise.then((lastRegistrations) => {
        self.lastRegistrations = lastRegistrations;
        return self.lastRegistrations;
      });
  };

  /* ----------  OFFER  ----------*/

  /**
   *  Get the current offer information.
   *  Call GET /telephony/{billingAccount}/line/{serviceName}/offer API.
   *
   *  @return {Promise} That return an Object representing the current offer informations.
   */
  TelephonyGroupLine.prototype.getCurrentOfferInformations = function getCurrentOfferInformations() {
    const self = this;

    return OvhApiTelephony.Line()
      .v6()
      .offer({
        billingAccount: self.billingAccount,
        serviceName: self.serviceName,
      })
      .$promise.then((infos) => {
        self.offerInformations = new TelephonyGroupLineOffer(
          angular.extend(infos, {
            details: self.offers,
          }),
        );

        return infos;
      });
  };

  /**
   *  Get available offers for a offerChange operation.
   *  Call GET /telephony/{billingAccount}/service/{serviceName}/offerChanges API.
   *
   *  @return {Promise} That return an Array of Object representing offers.
   */
  TelephonyGroupLine.prototype.getAvailableOffers = function getAvailableOffers() {
    const self = this;

    return OvhApiTelephony.Service()
      .v6()
      .offerChanges({
        billingAccount: self.billingAccount,
        serviceName: self.serviceName,
      })
      .$promise.then((offers) =>
        map(offers, (offer) => new TelephonyGroupLineOffer(offer)),
      );
  };

  /**
   *  Call POST /telephony/{billingAccount}/service/{serviceName}/offerChange API
   *  that run a offerChange.
   *
   *  @param  {Object} newOffer The new offer to change for.
   *  This is an object returned by
   *  GET /telephony/{billingAccount}/service/{serviceName}/offerChanges API.
   *  @param  {String} newOffer.name The name of the offer.
   *  @param  {String} newOffer.description The description of the offer.
   *
   *  @return {Promise} That return the current instance of line.
   */
  TelephonyGroupLine.prototype.changeOffer = function changeOffer(newOffer) {
    const self = this;

    return OvhApiTelephony.Service()
      .v6()
      .changeOffer(
        {
          billingAccount: self.billingAccount,
          serviceName: self.serviceName,
        },
        {
          offer: newOffer.name,
        },
      )
      .$promise.then(() => {
        self.pendingOfferChange = newOffer;
        return self;
      });
  };

  /**
   *  Check if an offerChange operation is doing.
   *  Call GET /telephony/{billingAccount}/service/{serviceName}/offerChange API.
   *
   *  @return {Promise} That return an object representing the new offer.
   */
  TelephonyGroupLine.prototype.getOfferChange = function getOfferChange() {
    const self = this;

    return OvhApiTelephony.Service()
      .v6()
      .offerChange({
        billingAccount: self.billingAccount,
        serviceName: self.serviceName,
      })
      .$promise.then(
        (offer) =>
          self.getAvailableOffers().then((availableOffers) => {
            self.pendingOfferChange =
              find(availableOffers, {
                name: offer.offer,
              }) || null; // if null is returned, it means there is a problem with API... :-D

            return self.pendingOfferChange;
          }),
        (error) => {
          if (error.status === 404) {
            return null;
          }
          return $q.reject(error);
        },
      );
  };

  /**
   *  Cancel an offerChange process.
   *  Call DELETE /telephony/{billingAccount}/service/{serviceName}/offerChange API.
   *
   *  @return {Promise} That return current instance of GroupLine.
   */
  TelephonyGroupLine.prototype.cancelOfferChange = function cancelOfferChange() {
    const self = this;

    return OvhApiTelephony.Service()
      .v6()
      .cancelOfferChange({
        billingAccount: self.billingAccount,
        serviceName: self.serviceName,
      })
      .$promise.then(() => {
        self.pendingOfferChange = null;
        return self;
      });
  };

  /* ----------  SIP DOMAIN  ----------*/

  TelephonyGroupLine.prototype.getAvailableSipDomains = function getAvailableSipDomains() {
    const self = this;

    return OvhApiTelephony.Line()
      .v6()
      .sipDomains({
        billingAccount: self.billingAccount,
        serviceName: self.serviceName,
      })
      .$promise.then((availableDomains) => availableDomains);
  };

  /* ----------  SCHEDULER  ----------*/

  TelephonyGroupLine.prototype.getScheduler = function getScheduler() {
    const self = this;

    if (!self.scheduler) {
      self.scheduler = new VoipScheduler({
        billingAccount: self.billingAccount,
        serviceName: self.serviceName,
      });
    }

    return self.scheduler.get();
  };

  /* ----------  TIME CONDITION  ----------*/

  TelephonyGroupLine.prototype.getTimeCondition = function getTimeCondition() {
    const self = this;

    if (!self.timeCondition) {
      self.timeCondition = new VoipTimeCondition({
        featureType: 'sip',
        billingAccount: self.billingAccount,
        serviceName: self.serviceName,
      });
    }

    return self.timeCondition.init();
  };

  /* ----------  EDITION  ----------*/

  TelephonyGroupLine.prototype.startEdition = function startEdition() {
    const self = this;

    self.inEdition = true;

    self.saveForEdition = {
      description: angular.copy(self.description),
      notifications: angular.copy(self.notifications),
      options: angular.copy(self.options),
    };

    return self;
  };

  TelephonyGroupLine.prototype.stopEdition = function stopEdition(cancel) {
    const self = this;

    if (self.saveForEdition && cancel) {
      self.description = angular.copy(self.saveForEdition.description);
      self.notifications = angular.copy(self.saveForEdition.notifications);
      self.options = angular.copy(self.saveForEdition.options);
    }

    self.saveForEdition = null;
    self.inEdition = false;

    return self;
  };

  TelephonyGroupLine.prototype.hasChange = function hasChange(path) {
    const self = this;

    return get(self.saveForEdition, path) !== get(self, path);
  };

  /* -----  End of PROTOTYPE METHODS  ------*/

  return TelephonyGroupLine;
};
