import assignIn from 'lodash/assignIn';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';
import map from 'lodash/map';
import pick from 'lodash/pick';
import remove from 'lodash/remove';
import set from 'lodash/set';
import orderBy from 'lodash/orderBy';
import filter from 'lodash/filter';

angular.module('managerApp').service('TelecomTelephonyLineCallsForwardService', function TelecomTelephonyLineCallsForwardService(
  $q, $translate, OvhApiTelephony, TelecomTelephonyLineCallsForwardPhoneNumber,
  TelecomTelephonyLineCallsForward, TelecomTelephonyLineCallsForwardNature, tucVoipLinePhone,
) {
  /**
   * @param  {String} billingAccount Billing account
   * @param  {String} serviceName    Service name
   * @param  {Object} forwards       Data to save
   * @return {Promise}
   */
  this.saveForwards = function saveForwards(billingAccount, serviceName, forwards) {
    const dataToSave = {};
    forEach(forwards, (elt) => {
      assignIn(dataToSave, elt.saveData);
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
  this.loadNatures = function loadNatures() {
    return OvhApiTelephony.v6().schema().$promise.then((schema) => {
      if (schema.models && schema.models['telephony.LineOptionForwardNatureTypeEnum'] && schema.models['telephony.LineOptionForwardNatureTypeEnum'].enum) {
        return map(
          schema.models['telephony.LineOptionForwardNatureTypeEnum'].enum,
          (elt) => new TelecomTelephonyLineCallsForwardNature(elt),
        ).concat(new TelecomTelephonyLineCallsForwardNature('external'));
      }
      return $q.reject();
    });
  };

  /**
   * Load all numbers from all billing accounts
   * @return {Promise}
   */
  this.loadAllOvhNumbers = function loadAllOvhNumbers(excludeLine) {
    return OvhApiTelephony.Number().Aapi().all().$promise.then((ovhNums) => {
      if (excludeLine) {
        remove(
          ovhNums,
          { type: 'line', serviceName: excludeLine },
        );
      }

      // look for plug&phone lines
      return tucVoipLinePhone.fetchAll().then((phones) => phones).catch(() => null)
        .then((phones) => orderBy(
          filter(
            map(
              forEach(
                ovhNums,
                (num) => {
                  set(num, 'hasPhone', !isUndefined(find(phones, { serviceName: num.serviceName })));
                },
              ),
              (num) => new TelecomTelephonyLineCallsForwardPhoneNumber(
                pick(num, ['billingAccount', 'description', 'serviceName', 'type', 'hasPhone']),
              ),
            ),
            (num) => ['fax', 'voicemail', 'line', 'plug&phone', 'number'].indexOf(num.type) > -1,
          ),
          ['description', 'serviceName'], ['desc', 'asc'],
        ));
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
  this.loadForwards = function loadForwards(
    billingAccount, serviceName, lineOptionForwardNatureTypeEnum,
    allOvhNumbers,
  ) {
    return OvhApiTelephony.Line().Options().v6().get({
      billingAccount,
      serviceName,
    }).$promise.then((options) => {
      forEach(
        options,
        (data, key) => {
          if (/^forward\w*Nature$/.test(key)) {
            options[key] = isString(data) ? find(lineOptionForwardNatureTypeEnum, { value: data }) : data; // eslint-disable-line
          }
          if (/^forward\w*Number$/.test(key)) {
            options[key] = find(allOvhNumbers, { serviceName: data }); // eslint-disable-line

            // Not OVH number
            if (!options[key]) {
              const matcher = key.match(/^forward(\w*)Number$/);
              const natureKey = ['forward', matcher[1], 'Nature'].join('');
              options[key] = new TelecomTelephonyLineCallsForwardPhoneNumber({ // eslint-disable-line
                serviceName: data,
                type: 'external',
              });
              options[natureKey] = find(lineOptionForwardNatureTypeEnum, { value: 'external' }); // eslint-disable-line
            }
          }
        },
      );
      return map(
        ['Unconditional', 'NoReply', 'Busy', 'Backup'],
        (elt) => new TelecomTelephonyLineCallsForward(options, elt),
      );
    });
  };

  this.resetAllCache = function resetAllCache() {
    OvhApiTelephony.Number().resetCache();
    OvhApiTelephony.Line().Options().resetCache();
    OvhApiTelephony.v6().resetCache();
  };
});
