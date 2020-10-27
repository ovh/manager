import chunk from 'lodash/chunk';
import difference from 'lodash/difference';
import find from 'lodash/find';
import get from 'lodash/get';
import head from 'lodash/head';
import isEqual from 'lodash/isEqual';
import map from 'lodash/map';
import now from 'lodash/now';
import sortBy from 'lodash/sortBy';
import random from 'lodash/random';
import remove from 'lodash/remove';

export default /* @ngInject */ (
  $q,
  OvhApiTelephony,
  TelephonyGroupNumberOvhPabxMenuEntry,
) => {
  const allDtmfKeys = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '*',
    '0',
    '#',
  ];

  /*= ==================================
    =            CONSTRUCTOR            =
    =================================== */

  function TelephonyGroupNumberOvhPabxMenu(menuOptionsParam) {
    let menuOptions = menuOptionsParam;

    if (!menuOptions) {
      menuOptions = {};
    }

    // check for mandatory options
    if (!menuOptions.billingAccount) {
      throw new Error(
        'billingAccount option must be specified when creating a new TelephonyGroupNumberOvhPabxMenu',
      );
    }

    if (!menuOptions.serviceName) {
      throw new Error(
        'serviceName option must be specified when creating a new TelephonyGroupNumberOvhPabxMenu',
      );
    }

    // set mandatory attributes
    this.billingAccount = menuOptions.billingAccount;
    this.serviceName = menuOptions.serviceName;

    // other attributes
    this.menuId = menuOptions.menuId || random(now());
    this.name = null;
    this.greetSound = null;
    this.greetSoundTts = null;
    this.invalidSound = null;
    this.invalidSoundTts = null;

    // custom attributes
    this.inEdition = false;
    this.saveForEdition = null;
    this.status = null;
    this.entries = [];

    // used to store the saved values of the parent (menuEntry or extensionRule)
    this.oldParent = menuOptions.oldParent;

    this.setInfos(menuOptions);
  }

  /* -----  End of CONSTRUCTOR  ------*/

  TelephonyGroupNumberOvhPabxMenu.prototype.setInfos = function setInfos(
    menuOptions,
  ) {
    const self = this;

    self.name = menuOptions.name || null;
    self.greetSound = menuOptions.greetSound || null;
    self.greetSoundTts = menuOptions.greetSoundTts || null;
    self.invalidSound = menuOptions.invalidSound || null;
    self.invalidSoundTts = menuOptions.invalidSoundTts || null;
    self.status = menuOptions.status || 'OK';

    return self;
  };

  /*= ========================================
    =            PROTOTYPE METHODS            =
    ========================================= */

  /* ----------  API CALLS  ----------*/

  TelephonyGroupNumberOvhPabxMenu.prototype.create = function create() {
    const self = this;

    self.status = 'IN_CREATION';

    return OvhApiTelephony.OvhPabx()
      .Menu()
      .v6()
      .create(
        {
          billingAccount: self.billingAccount,
          serviceName: self.serviceName,
        },
        {
          greetSound: self.greetSound,
          greetSoundTts: self.greetSoundTts,
          invalidSound: self.invalidSound,
          invalidSoundTts: self.invalidSoundTts,
          name: self.name,
        },
      )
      .$promise.then(
        (menuOptions) => {
          self.menuId = menuOptions.menuId;
          self.status = 'OK';
          return self;
        },
        (error) => {
          self.status = 'DRAFT';
          return $q.reject(error);
        },
      );
  };

  TelephonyGroupNumberOvhPabxMenu.prototype.save = function save() {
    const self = this;

    self.status = 'SAVING';

    return OvhApiTelephony.OvhPabx()
      .Menu()
      .v6()
      .save(
        {
          billingAccount: self.billingAccount,
          serviceName: self.serviceName,
          menuId: self.menuId,
        },
        {
          greetSound: self.greetSound,
          greetSoundTts: self.greetSoundTts,
          invalidSound: self.invalidSound,
          invalidSoundTts: self.invalidSoundTts,
          name: self.name,
        },
      )
      .$promise.then(() => self)
      .finally(() => {
        // in all case status is OK
        self.status = 'OK';
      });
  };

  TelephonyGroupNumberOvhPabxMenu.prototype.remove = function removeFunction() {
    const self = this;

    self.status = 'DELETING';

    return OvhApiTelephony.OvhPabx()
      .Menu()
      .v6()
      .remove({
        billingAccount: self.billingAccount,
        serviceName: self.serviceName,
        menuId: self.menuId,
      })
      .$promise.finally(() => {
        // in all case status is OK
        self.status = 'OK';
      });
  };

  /* ----------  ENTRIES  ----------*/

  TelephonyGroupNumberOvhPabxMenu.prototype.getEntries = function getEntries() {
    const self = this;

    return OvhApiTelephony.OvhPabx()
      .Menu()
      .Entry()
      .v6()
      .query({
        billingAccount: self.billingAccount,
        serviceName: self.serviceName,
        menuId: self.menuId,
      })
      .$promise.then((menuEntryIds) =>
        $q.all(
          map(chunk(menuEntryIds, 50), (chunkIds) =>
            OvhApiTelephony.OvhPabx()
              .Menu()
              .Entry()
              .v6()
              .getBatch({
                billingAccount: self.billingAccount,
                serviceName: self.serviceName,
                menuId: self.menuId,
                entryId: chunkIds,
              })
              .$promise.then((resources) => {
                angular.forEach(
                  sortBy(map(resources, 'value'), 'position'),
                  (menuEntryOptions) => {
                    self.addEntry(menuEntryOptions);
                  },
                );
                return self;
              }),
          ),
        ),
      );
  };

  TelephonyGroupNumberOvhPabxMenu.prototype.addEntry = function addEntry(
    menuEntryOptionsParam,
  ) {
    const self = this;
    let entry = null;
    let menuEntryOptions = menuEntryOptionsParam;

    if (!menuEntryOptions) {
      menuEntryOptions = {};
    }

    if (menuEntryOptions.entryId) {
      entry = find(self.entries, {
        entryId: menuEntryOptions.entryId,
      });
    }

    if (entry) {
      if (entry.inEdition) {
        return entry;
      }
      entry.setInfos(menuEntryOptions);
    } else {
      entry = new TelephonyGroupNumberOvhPabxMenuEntry(
        angular.extend(menuEntryOptions, {
          billingAccount: self.billingAccount,
          serviceName: self.serviceName,
          menuId: self.menuId,
        }),
      );
      self.entries.push(entry);
    }

    return entry;
  };

  TelephonyGroupNumberOvhPabxMenu.prototype.removeEntry = function removeEntry(
    entry,
  ) {
    const self = this;

    remove(self.entries, entry);

    return self;
  };

  TelephonyGroupNumberOvhPabxMenu.prototype.hasAvailableDtmfEntryKey = function hasAvailableDtmfEntryKey() {
    const self = this;
    return !!self.getFirstAvailableDtmfEntryKey();
  };

  TelephonyGroupNumberOvhPabxMenu.prototype.getFirstAvailableDtmfEntryKey = function getFirstAvailableDtmfEntryKey() {
    const self = this;
    return head(difference(allDtmfKeys, map(self.entries, 'dtmf')));
  };

  TelephonyGroupNumberOvhPabxMenu.prototype.getAllDtmfEntryKeys = function getAllDtmfEntryKeys() {
    return allDtmfKeys;
  };

  /* ----------  EDITION  ----------*/

  TelephonyGroupNumberOvhPabxMenu.prototype.startEdition = function startEdition() {
    const self = this;

    self.inEdition = true;
    self.saveForEdition = {
      name: angular.copy(self.name),
      greetSound: angular.copy(self.greetSound),
      greetSoundTts: angular.copy(self.greetSoundTts),
      invalidSound: angular.copy(self.invalidSound),
      invalidSoundTts: angular.copy(self.invalidSoundTts),
      status: angular.copy(self.status),
    };

    return self;
  };

  TelephonyGroupNumberOvhPabxMenu.prototype.stopEdition = function stopEdition(
    cancel,
  ) {
    const self = this;

    if (self.saveForEdition && cancel) {
      self.name = angular.copy(self.saveForEdition.name);
      self.greetSound = angular.copy(self.saveForEdition.greetSound);
      self.greetSoundTts = angular.copy(self.saveForEdition.greetSoundTts);
      self.invalidSound = angular.copy(self.saveForEdition.invalidSound);
      self.invalidSoundTts = angular.copy(self.saveForEdition.invalidSoundTts);
      self.status = angular.copy(self.saveForEdition.status);
    }

    self.saveForEdition = null;
    self.inEdition = false;

    return self;
  };

  TelephonyGroupNumberOvhPabxMenu.prototype.hasChange = function hasChange(
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
      self.hasChange('name') ||
      self.hasChange('greetSound') ||
      self.hasChange('invalidSound') ||
      self.hasChange('greetSoundTts') ||
      self.hasChange('invalidSoundTts')
    );
  };

  /* -----  End of PROTOTYPE METHODS  ------*/

  return TelephonyGroupNumberOvhPabxMenu;
};
