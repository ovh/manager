import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import now from 'lodash/now';
import random from 'lodash/random';

export default /* @ngInject */ ($q, OvhApiTelephony) => {
  /*= ==================================
    =            CONSTRUCTOR            =
    =================================== */

  function TelephonyGroupNumberOvhPabxMenuEntry(menuEntryOptionsParam) {
    let menuEntryOptions = menuEntryOptionsParam;

    if (!menuEntryOptions) {
      menuEntryOptions = {};
    }

    // check for mandatory options
    if (!menuEntryOptions.billingAccount) {
      throw new Error(
        'billingAccount option must be specified when creating a new TelephonyGroupNumberOvhPabxMenuEntry',
      );
    }

    if (!menuEntryOptions.serviceName) {
      throw new Error(
        'serviceName option must be specified when creating a new TelephonyGroupNumberOvhPabxMenuEntry',
      );
    }

    if (!menuEntryOptions.menuId) {
      throw new Error(
        'menuId option must be specified when creating a new TelephonyGroupNumberOvhPabxMenuEntry',
      );
    }

    // set mandatory attributes
    this.billingAccount = menuEntryOptions.billingAccount;
    this.serviceName = menuEntryOptions.serviceName;
    this.menuId = menuEntryOptions.menuId;

    // other attributes
    this.entryId = menuEntryOptions.entryId || random(now());
    this.action = null;
    this.actionParam = null;
    this.dtmf = null;
    this.position = null;

    // custom attributes
    this.inEdition = false;
    this.saveForEdition = null;
    this.status = null;
    this.menuSub = null;

    this.setInfos(menuEntryOptions);
  }

  /* -----  End of CONSTRUCTOR  ------*/

  TelephonyGroupNumberOvhPabxMenuEntry.prototype.setInfos = function setInfos(
    menuEntryOptions,
  ) {
    const self = this;

    self.action = menuEntryOptions.action || 'setCallerName';
    self.dtmf = menuEntryOptions.dtmf || null;
    self.position = menuEntryOptions.position || null;
    self.status = menuEntryOptions.status || 'OK';

    // special rule for action param
    if (
      self.action === 'playback' ||
      self.action === 'menuSub' ||
      self.action === 'callcenter'
    ) {
      self.actionParam = menuEntryOptions.actionParam
        ? parseInt(menuEntryOptions.actionParam, 10)
        : '';
    } else {
      self.actionParam = menuEntryOptions.actionParam || '';
    }

    return self;
  };

  /*= ========================================
    =            PROTOTYPE METHODS            =
    ========================================= */

  /* ----------  API CALLS  ----------*/

  TelephonyGroupNumberOvhPabxMenuEntry.prototype.create = function create() {
    const self = this;

    self.status = 'IN_CREATION';

    return OvhApiTelephony.OvhPabx()
      .Menu()
      .Entry()
      .v6()
      .create(
        {
          billingAccount: self.billingAccount,
          serviceName: self.serviceName,
          menuId: self.menuId,
        },
        {
          action: self.action,
          actionParam: self.actionParam,
          dtmf: self.dtmf,
          position: self.position,
        },
      )
      .$promise.then(
        (menuEntryOptions) => {
          self.entryId = menuEntryOptions.entryId;
          self.status = 'OK';
          return self;
        },
        (error) => {
          self.status = 'DRAFT';
          return $q.reject(error);
        },
      );
  };

  TelephonyGroupNumberOvhPabxMenuEntry.prototype.save = function save() {
    const self = this;

    self.status = 'SAVING';

    return OvhApiTelephony.OvhPabx()
      .Menu()
      .Entry()
      .v6()
      .save(
        {
          billingAccount: self.billingAccount,
          serviceName: self.serviceName,
          menuId: self.menuId,
          entryId: self.entryId,
        },
        {
          action: self.action,
          actionParam: self.actionParam,
          dtmf: self.dtmf,
          position: self.position,
        },
      )
      .$promise.then(() => self)
      .finally(() => {
        // in all case status is OK
        self.status = 'OK';
      });
  };

  TelephonyGroupNumberOvhPabxMenuEntry.prototype.remove = function remove() {
    const self = this;

    self.status = 'DELETING';

    return OvhApiTelephony.OvhPabx()
      .Menu()
      .Entry()
      .v6()
      .remove({
        billingAccount: self.billingAccount,
        serviceName: self.serviceName,
        menuId: self.menuId,
        entryId: self.entryId,
      })
      .$promise.finally(() => {
        // in all case status is OK
        self.status = 'OK';
      });
  };

  /* ----------  EDITION  ----------*/

  TelephonyGroupNumberOvhPabxMenuEntry.prototype.startEdition = function startEdition() {
    const self = this;

    self.inEdition = true;
    self.saveForEdition = {
      action: angular.copy(self.action),
      actionParam: angular.copy(self.actionParam),
      dtmf: angular.copy(self.dtmf),
      position: angular.copy(self.position),
      status: angular.copy(self.status),
    };

    return self;
  };

  TelephonyGroupNumberOvhPabxMenuEntry.prototype.stopEdition = function stopEdition(
    cancel,
    saveForEdition,
  ) {
    const self = this;

    if (self.saveForEdition && cancel) {
      self.action = angular.copy(self.saveForEdition.action);
      self.actionParam = angular.copy(self.saveForEdition.actionParam);
      self.dtmf = angular.copy(self.saveForEdition.dtmf);
      self.position = angular.copy(self.saveForEdition.position);
      self.status = angular.copy(self.saveForEdition.status);
    } else if (saveForEdition && cancel) {
      self.action = angular.copy(saveForEdition.action);
      self.actionParam = angular.copy(saveForEdition.actionParam);
      self.dtmf = angular.copy(saveForEdition.dtmf);
      self.position = angular.copy(saveForEdition.position);
      self.status = angular.copy(saveForEdition.status);
    }

    self.saveForEdition = null;
    self.inEdition = false;

    return self;
  };

  TelephonyGroupNumberOvhPabxMenuEntry.prototype.hasChange = function hasChange(
    attr,
  ) {
    const self = this;

    if (!self.inEdition || !self.saveForEdition) {
      return false;
    }

    if (attr) {
      return !isEqual(get(self.saveForEdition, attr), get(self, attr));
    }
    return (
      self.hasChange('action') ||
      self.hasChange('actionParam') ||
      self.hasChange('dtmf')
    );
  };

  /* -----  End of PROTOTYPE METHODS  ------*/

  return TelephonyGroupNumberOvhPabxMenuEntry;
};
