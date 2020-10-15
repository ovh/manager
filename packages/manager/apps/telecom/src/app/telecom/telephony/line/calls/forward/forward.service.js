import assignIn from 'lodash/assignIn';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import map from 'lodash/map';

import { FORWARD_TYPES } from './forward.constants';

export default /* @ngInject */ function TelecomTelephonyLineCallsForwardService(
  $http,
  $q,
  OvhApiTelephony,
  TelecomTelephonyLineCallsForwardPhoneNumber,
  TelecomTelephonyLineCallsForward,
  TelecomTelephonyLineCallsForwardNature,
) {
  /**
   * @param  {String} billingAccount Billing account
   * @param  {String} serviceName    Service name
   * @param  {Object} forwards       Data to save
   * @return {Promise}
   */
  this.saveForwards = function saveForwards(
    billingAccount,
    serviceName,
    forwards,
  ) {
    const dataToSave = {};
    forEach(forwards, (elt) => {
      assignIn(dataToSave, elt.saveData);
    });
    return OvhApiTelephony.Line()
      .Options()
      .v6()
      .update(
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
    return OvhApiTelephony.v6()
      .schema()
      .$promise.then((schema) => {
        if (
          schema.models &&
          schema.models['telephony.LineOptionForwardNatureTypeEnum'] &&
          schema.models['telephony.LineOptionForwardNatureTypeEnum'].enum
        ) {
          return map(
            schema.models['telephony.LineOptionForwardNatureTypeEnum'].enum,
            (elt) => new TelecomTelephonyLineCallsForwardNature(elt),
          ).concat(new TelecomTelephonyLineCallsForwardNature('external'));
        }
        return $q.reject();
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
    billingAccount,
    serviceName,
    lineOptionForwardNatureTypeEnum,
  ) {
    return OvhApiTelephony.Line()
      .Options()
      .v6()
      .get({
        billingAccount,
        serviceName,
      })
      .$promise.then((options) => {
        const numbers = map(FORWARD_TYPES, (forwardType) =>
          $q
            .all({
              services: options[`forward${forwardType}Number`]
                ? $http
                    .get('/telephony/searchServices', {
                      params: {
                        axiom: options[`forward${forwardType}Number`],
                      },
                    })
                    .then(({ data }) => data)
                : [],
              nature: forwardType,
            })
            .then(({ services, nature }) => {
              const isExternal = !services.length;
              const number = options[`forward${nature}Number`];
              const forwardOptions = {
                ...options,
                [`forward${nature}Number`]: isExternal
                  ? new TelecomTelephonyLineCallsForwardPhoneNumber({
                      serviceName: number,
                      type: 'external',
                    })
                  : new TelecomTelephonyLineCallsForwardPhoneNumber({
                      serviceName: number,
                      type: options[`forward${nature}Nature`],
                    }),
                [`forward${nature}Nature`]: isExternal
                  ? find(lineOptionForwardNatureTypeEnum, {
                      value: 'external',
                    })
                  : find(lineOptionForwardNatureTypeEnum, {
                      value: options[`forward${nature}Nature`],
                    }),
              };
              return new TelecomTelephonyLineCallsForward(
                forwardOptions,
                nature,
              );
            }),
        );

        return $q.all(numbers);
      });
  };

  this.resetAllCache = function resetAllCache() {
    OvhApiTelephony.Number().resetCache();
    OvhApiTelephony.Line()
      .Options()
      .resetCache();
    OvhApiTelephony.v6().resetCache();
  };
}
