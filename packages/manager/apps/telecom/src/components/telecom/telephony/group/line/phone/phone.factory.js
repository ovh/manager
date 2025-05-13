import filter from 'lodash/filter';
import isEqual from 'lodash/isEqual';
import keys from 'lodash/keys';
import map from 'lodash/map';

export default /* @ngInject */ (
  $q,
  OvhApiTelephony,
  TelephonyGroupLinePhoneFunction,
  TelephonyGroupLinePhoneConfiguration,
) => {
  const mandatoriesPhoneOptions = ['billingAccount', 'serviceName'];
  let mandatoryNb;

  /*= ==================================
        =            CONSTRUCTOR            =
        =================================== */

  function TelephonyGroupLinePhone(mandatoryOptions, phoneOptionsParam) {
    let phoneOptions = phoneOptionsParam;

    mandatoryNb = mandatoriesPhoneOptions.length;
    if (!mandatoryOptions) {
      throw new Error(
        'mandatory options must be specified when creating a new TelephonyGroupLinePhone',
      );
    } else {
      // eslint-disable-next-line no-plusplus
      for (mandatoryNb; mandatoryNb--; ) {
        if (!mandatoryOptions[mandatoriesPhoneOptions[mandatoryNb]]) {
          // check mandatory attributes
          throw new Error(
            `${mandatoriesPhoneOptions[mandatoryNb]} option must be specified when creating a new TelephonyGroupLinePhone`,
          );
        } else {
          // set mandatory attributes
          this[mandatoriesPhoneOptions[mandatoryNb]] =
            mandatoryOptions[mandatoriesPhoneOptions[mandatoryNb]];
        }
      }
    }

    if (!phoneOptions) {
      phoneOptions = {};
    }

    this.protocol = null;
    this.macAddress = null;
    this.brand = null;
    this.ip = null;
    this.sip = null;
    this.options = null;
    this.configurations = [];

    this.setPhoneInfos(phoneOptions);
  }

  /* -----  End of CONSTRUCTOR  ------*/

  /*= ========================================
    =            PROTOTYPE METHODS            =
    ========================================= */

  /* ----------  FEATURE OPTIONS  ----------*/

  TelephonyGroupLinePhone.prototype.getFormattedMacAddress = function getFormattedMacAddress() {
    const self = this;

    return self.macAddress !== ''
      ? self.macAddress.match(/.{2}/g).join(':')
      : '';
  };

  TelephonyGroupLinePhone.prototype.setPhoneInfos = function setPhoneInfos(
    phoneOptions,
  ) {
    const self = this;

    angular.forEach(keys(phoneOptions), (phoneOptionsKey) => {
      if (phoneOptionsKey === 'phoneConfiguration') {
        self.setConfigurations(phoneOptions[phoneOptionsKey]);
      } else if (phoneOptionsKey.indexOf('$') !== 0) {
        self[phoneOptionsKey] = phoneOptions[phoneOptionsKey];
      }
    });

    return self;
  };

  TelephonyGroupLinePhone.prototype.getPhone = function getPhone() {
    const self = this;

    return OvhApiTelephony.Line()
      .Phone()
      .v6()
      .get({
        billingAccount: self.billingAccount,
        serviceName: self.serviceName,
      })
      .$promise.then(
        (phoneOptions) => phoneOptions,
        () => null,
      );
  };

  TelephonyGroupLinePhone.prototype.getSip = function getSip() {
    const self = this;

    return OvhApiTelephony.Line()
      .Options()
      .v6()
      .get({
        billingAccount: self.billingAccount,
        serviceName: self.serviceName,
      })
      .$promise.then(
        (options) => ({
          user: self.serviceName,
          authorizeUser: self.serviceName,
          domains: options.domain,
          localIp: null,
          publicIp: null,
        }),
        () => null,
      );
  };

  TelephonyGroupLinePhone.prototype.getIps = function getIps() {
    const self = this;

    return OvhApiTelephony.Line()
      .v6()
      .ips({
        billingAccount: self.billingAccount,
        serviceName: self.serviceName,
      })
      .$promise.then(
        (ips) => {
          if (ips.length) {
            return ips[ips.length - 1];
          }
          return null;
        },
        () => null,
      );
  };

  TelephonyGroupLinePhone.prototype.getRMAs = function getRMAs() {
    const self = this;

    return OvhApiTelephony.Line()
      .Phone()
      .RMA()
      .v6()
      .query({
        billingAccount: self.billingAccount,
        serviceName: self.serviceName,
      })
      .$promise.then(
        (RMAs) => {
          const RMADetailsRequests = [];
          angular.forEach(RMAs, (RMAId) => {
            RMADetailsRequests.push(
              OvhApiTelephony.Line()
                .Phone()
                .RMA()
                .v6()
                .get({
                  billingAccount: self.billingAccount,
                  serviceName: self.serviceName,
                  id: RMAId,
                })
                .$promise.then(
                  (RMADetails) => RMADetails,
                  () => null,
                ),
            );
          });
          return $q.all(RMADetailsRequests);
        },
        () => null,
      );
  };

  TelephonyGroupLinePhone.prototype.resetConfig = function resetConfig(ip) {
    const self = this;

    return OvhApiTelephony.Line()
      .Phone()
      .v6()
      .resetConfig(
        {
          billingAccount: self.billingAccount,
          serviceName: self.serviceName,
        },
        {
          ip,
        },
      ).$promise;
  };

  TelephonyGroupLinePhone.prototype.hasPhone = function hasPhone() {
    const self = this;
    return self.macAddress && self.brand;
  };

  TelephonyGroupLinePhone.prototype.getFunctionKeys = function getFunctionKeys() {
    const self = this;

    if (self.hasPhone()) {
      return new TelephonyGroupLinePhoneFunction({
        serviceName: self.serviceName,
        billingAccount: self.billingAccount,
      })
        .getFunctions()
        .then((functionKeys) => {
          const buildFunctionKeys = [];
          angular.forEach(functionKeys, (key) => {
            buildFunctionKeys.push(
              new TelephonyGroupLinePhoneFunction(
                {
                  serviceName: self.serviceName,
                  billingAccount: self.billingAccount,
                },
                key,
              ),
            );
          });
          return buildFunctionKeys;
        });
    }
    return $q.reject([]);
  };

  /* ----------  CONFIGURATIONS  ----------*/

  TelephonyGroupLinePhone.prototype.setConfigurations = function setConfigurations(
    configurationOptions,
  ) {
    const self = this;

    angular.forEach(configurationOptions, (options) => {
      self.configurations.push(
        new TelephonyGroupLinePhoneConfiguration(options),
      );
    });

    return self;
  };

  TelephonyGroupLinePhone.prototype.changePhoneConfiguration = function changePhoneConfiguration(
    configsToSaveParam,
    refreshPhone,
    reboot,
  ) {
    const self = this;
    let configsToSave = configsToSaveParam;

    if (!configsToSave) {
      configsToSave = filter(
        self.configurations,
        (config) => !isEqual(config.value, config.prevValue),
      );
    }

    return OvhApiTelephony.Line()
      .Phone()
      .v6()
      .changePhoneConfiguration(
        {
          serviceName: self.serviceName,
          billingAccount: self.billingAccount,
        },
        {
          newConfigurations: map(configsToSave, (config) => ({
            key: config.name,
            value: config.value.toString(),
          })),
          autoReboot: reboot,
        },
      )
      .$promise.then(() => {
        if (refreshPhone) {
          return self.getPhone().then((phoneOptions) => {
            self.configurations = [];
            return self.setConfigurations(phoneOptions.phoneConfiguration);
          });
        }
        return self;
      });
  };

  /* ----------  INITIALIZATION  ----------*/

  TelephonyGroupLinePhone.prototype.initDeffered = function initDeffered() {
    const self = this;

    return $q
      .all([
        self.getSip().then((sip) => self.setPhoneInfos({ sip })),
        self.getIps().then((ip) => self.setPhoneInfos({ ip })),
      ])
      .then(() =>
        self
          .getFunctionKeys()
          .then(
            (functionKey) => self.setPhoneInfos({ functionKeys: functionKey }),
            () => self.setPhoneInfos({ functionKeys: [] }),
          )
          .then(() => self),
      );
  };

  /* -----  End of PROTOTYPE METHODS  ------*/

  return TelephonyGroupLinePhone;
};
