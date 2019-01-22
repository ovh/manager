import _ from 'lodash';

import template from './telecom-telephony-associate-device.html';

export default {
  bindings: {
    billingAccount: '<',
    serviceName: '<',
    macAddress: '=',
  },
  template,
  controller($scope, $state, $q, $translate, OvhApiTelephony, TelephonyMediator, TucToastError) {
    const self = this;

    self.$onInit = function $onInit() {
      self.isInitialized = false;
      self.selectedMac = null;
      self.ipAddress = null;
      self.attachSuccess = false;
      $scope.$watch('$ctrl.selectedMac', (mac) => {
        const phone = self.findPhoneByMac(mac);
        self.ipAddress = phone ? phone.ip : null;
      });
      return $translate.refresh().then(self.fetchAssociablesPhones).then((phones) => {
        self.phones = phones;
      }).catch(err => new TucToastError(err))
        .finally(() => {
          self.isInitialized = true;
        });
    };

    self.fetchAssociablesPhones = function fetchAssociablesPhones() {
      return OvhApiTelephony.Line().v6()
        .listAssociablePhones({
          billingAccount: self.billingAccount,
          serviceName: self.serviceName,
        }).$promise
        .then(phones => $q.all(_.map(phones, (phone) => {
          const line = _.first(phone.associatedLines).serviceName;
          return OvhApiTelephony.Line().Phone().v6()
            .get({
              billingAccount: self.billingAccount,
              serviceName: line,
            }).$promise
            .then(details => _.assign(phone, details))
            .then(thePhone => OvhApiTelephony.Line().v6()
              .ips({
                billingAccount: self.billingAccount,
                serviceName: line,
              }).$promise.then((ips) => {
                if (ips.length) {
                  _.set(thePhone, 'ip', _.first(ips).ip);
                }
                return thePhone;
              }));
        })));
    };

    self.findPhoneByMac = function findPhoneByMac(mac) {
      return _.find(self.phones, { macAddress: mac });
    };

    self.attachDevice = function attachDevice() {
      self.isAttaching = true;
      return OvhApiTelephony.Line().v6().associateDevice({
        billingAccount: self.billingAccount,
        serviceName: self.serviceName,
      }, {
        ipAddress: self.ipAddress,
        macAddress: self.macAddress,
      }).$promise.then(() => {
        self.attachSuccess = true;

        // Refresh cache and state
        OvhApiTelephony.Line().v6().resetAllCache();
        TelephonyMediator.resetAllCache();
        $state.reload();
      }).catch(err => new TucToastError(err)).finally(() => {
        self.isAttaching = false;
      });
    };
  },
};
