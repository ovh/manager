angular.module('managerApp').service('TelecomTelephonyLineCallsForwardService', function (
  $q, $translate, OvhApiTelephony, TelecomTelephonyLineCallsForwardPhoneNumber,
  TelecomTelephonyLineCallsForward, TelecomTelephonyLineCallsForwardNature, tucVoipLinePhone,
) {
  /**
   * @param  {String} billingAccount Billing account
   * @param  {String} serviceName    Service name
   * @param  {Object} forwards       Data to save
   * @return {Promise}
   */
  this.saveForwards = function (billingAccount, serviceName, forwards) {
    const dataToSave = {};
    _.forEach(forwards, (elt) => {
      _.extend(dataToSave, elt.saveData);
    });
    return OvhApiTelephony.Line().Options().v6().update(
      {
        billingAccount,
        serviceName,
      },
      dataToSave,
    ).$promise;
  };

  /**
   * Load all the natures of number
   * @return {Promise}
   */
  this.loadNatures = function () {
    return OvhApiTelephony.v6().schema().$promise.then((schema) => {
      if (schema.models && schema.models['telephony.LineOptionForwardNatureTypeEnum'] && schema.models['telephony.LineOptionForwardNatureTypeEnum'].enum) {
        return _.map(
          schema.models['telephony.LineOptionForwardNatureTypeEnum'].enum,
          elt => new TelecomTelephonyLineCallsForwardNature(elt),
        ).concat(new TelecomTelephonyLineCallsForwardNature('external'));
      }
      return $q.reject();
    });
  };

  /**
   * Load all numbers from all billing accounts
   * @return {Promise}
   */
  this.loadAllOvhNumbers = function (excludeLine) {
    return OvhApiTelephony.Number().Aapi().all().$promise.then((ovhNums) => {
      if (excludeLine) {
        _.remove(
          ovhNums,
          { type: 'line', serviceName: excludeLine },
        );
      }

      // look for plug&phone lines
      return tucVoipLinePhone.fetchAll().then(phones => phones).catch(() => null)
        .then(phones => _.chain(ovhNums).forEach((num) => {
          _.set(num, 'hasPhone', !_.isUndefined(_.find(phones, { serviceName: num.serviceName })));
        }).map(num => new TelecomTelephonyLineCallsForwardPhoneNumber(_.pick(num, ['billingAccount', 'description', 'serviceName', 'type', 'hasPhone']))).filter(num => ['fax', 'voicemail', 'line', 'plug&phone', 'number'].indexOf(num.type) > -1)
          .sortByOrder(['description', 'serviceName'], ['desc', 'asc'])
          .value());
    });
  };

  /**
   * Load all forwards for a given service name
   * @param  {String} billingAccount                  Billing account
   * @param  {String} serviceName                     Service name
   * @param   {Array} lineOptionForwardNatureTypeEnum All the natures of number
   * @param   {Array} allOvhNumbers                   All numbers from all billing accounts
   * @return {Promise}
   */
  this.loadForwards = function (
    billingAccount, serviceName, lineOptionForwardNatureTypeEnum,
    allOvhNumbers,
  ) {
    return OvhApiTelephony.Line().Options().v6().get({
      billingAccount,
      serviceName,
    }).$promise.then((options) => {
      _.forEach(
        options,
        (data, key) => {
          if (/^forward\w*Nature$/.test(key)) {
            options[key] = _.isString(data) ? _.find(lineOptionForwardNatureTypeEnum, { value: data }) : data; // eslint-disable-line
          }
          if (/^forward\w*Number$/.test(key)) {
            options[key] = _.find(allOvhNumbers, { serviceName: data }); // eslint-disable-line

            // Not OVH number
            if (!options[key]) {
              const matcher = key.match(/^forward(\w*)Number$/);
              const natureKey = ['forward', matcher[1], 'Nature'].join('');
              options[key] = new TelecomTelephonyLineCallsForwardPhoneNumber({ // eslint-disable-line
                serviceName: data,
                type: 'external',
              });
              options[natureKey] = _.find(lineOptionForwardNatureTypeEnum, { value: 'external' }); // eslint-disable-line
            }
          }
        },
      );
      return _.map(
        ['Unconditional', 'NoReply', 'Busy', 'Backup'],
        elt => new TelecomTelephonyLineCallsForward(options, elt),
      );
    });
  };

  this.resetAllCache = function () {
    OvhApiTelephony.Number().resetCache();
    OvhApiTelephony.Line().Options().resetCache();
    OvhApiTelephony.v6().resetCache();
  };
});
