import chunk from 'lodash/chunk';
import find from 'lodash/find';
import filter from 'lodash/filter';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import map from 'lodash/map';
import remove from 'lodash/remove';

export default /* @ngInject */ (
  $q,
  VoipScheduler,
  TelephonyGroupNumberOvhPabxDialplan,
  TelephonyGroupNumberOvhPabxSound,
  TelephonyGroupNumberOvhPabxMenu,
  TelephonyGroupNumberOvhPabxTts,
  OvhApiTelephony,
) => {
  /*= ==================================
    =            CONSTRUCTOR            =
    =================================== */

  function TelephonyGroupNumberOvhPabx(featureOptionsParam) {
    let featureOptions = featureOptionsParam;

    // check for mandatory options
    if (!featureOptions) {
      throw new Error(
        'mandatory options must be specified when creating a new TelephonyGroupNumberOvhPabx',
      );
    } else {
      if (!featureOptions.billingAccount) {
        throw new Error(
          'billingAccount option must be specified when creating a new TelephonyGroupNumberOvhPabx',
        );
      }

      if (!featureOptions.serviceName) {
        throw new Error(
          'serviceName option must be specified when creating a new TelephonyGroupNumberOvhPabx',
        );
      }

      if (!featureOptions.featureType) {
        throw new Error(
          'featureType option must be specified when creating a new TelephonyGroupNumberOvhPabx',
        );
      }
    }

    if (!featureOptions) {
      featureOptions = {};
    }

    // set mandatory attributes
    this.billingAccount = featureOptions.billingAccount;
    this.serviceName = featureOptions.serviceName;
    this.featureType = featureOptions.featureType;

    // set feature options
    this.setOptions(featureOptions);

    // custom attributes
    this.inEdition = false;
    this.saveForEdition = null;
    this.scheduler = null;
    this.dialplans = [];
    this.sounds = [];
    this.menus = [];
    this.queues = [];
    this.tts = [];
  }

  /* -----  End of CONSTRUCTOR  ------*/

  /*= ========================================
    =            PROTOTYPE METHODS            =
    ========================================= */

  /* ----------  FEATURE OPTIONS  ----------*/

  TelephonyGroupNumberOvhPabx.prototype.setOptions = function setOptions() {
    const self = this;

    return self;
  };

  /* ----------  HELPERS  ----------*/

  TelephonyGroupNumberOvhPabx.prototype.isCcs = function isCcs() {
    const self = this;

    return self.featureType === 'contactCenterSolutionExpert';
  };

  TelephonyGroupNumberOvhPabx.prototype.isTtsAvailable = function isTtsAvailable() {
    const self = this;

    return self.isCcs();
  };

  /* ----------  EDITION  ----------*/

  TelephonyGroupNumberOvhPabx.prototype.startEdition = function startEdition() {
    const self = this;

    self.inEdition = true;
    self.saveForEdition = {
      featureType: angular.copy(self.featureType),
    };

    return self;
  };

  TelephonyGroupNumberOvhPabx.prototype.stopEdition = function stopEdition(
    cancel,
  ) {
    const self = this;

    if (self.saveForEdition && cancel) {
      self.featureType = angular.copy(self.saveForEdition.featureType);
    }

    self.saveForEdition = null;
    self.inEdition = false;

    return self;
  };

  TelephonyGroupNumberOvhPabx.prototype.hasChange = function hasChange(attr) {
    const self = this;

    if (!self.inEdition || !self.saveForEdition) {
      return false;
    }

    if (attr) {
      return !isEqual(get(self.saveForEdition, attr), get(self, attr));
    }
    return self.hasChange('featureType');
  };

  /* ----------  SCHEDULER  ----------*/

  TelephonyGroupNumberOvhPabx.prototype.getScheduler = function getScheduler() {
    const self = this;

    if (!self.scheduler) {
      self.scheduler = new VoipScheduler({
        billingAccount: self.billingAccount,
        serviceName: self.serviceName,
      });
    }

    return self.scheduler.get();
  };

  /* ----------  DIALPLAN  ----------*/

  TelephonyGroupNumberOvhPabx.prototype.getDialplans = function getDialplans() {
    const self = this;

    return OvhApiTelephony.OvhPabx()
      .Dialplan()
      .v6()
      .query({
        billingAccount: self.billingAccount,
        serviceName: self.serviceName,
      })
      .$promise.then((dialplanIds) =>
        $q.all(
          map(chunk(dialplanIds, 50), (chunkIds) =>
            OvhApiTelephony.OvhPabx()
              .Dialplan()
              .v6()
              .getBatch({
                billingAccount: self.billingAccount,
                serviceName: self.serviceName,
                dialplanId: chunkIds,
              })
              .$promise.then((resources) => {
                angular.forEach(map(resources, 'value'), (dialplanOptions) => {
                  self.addDialplan(dialplanOptions);
                });
                return self;
              }),
          ),
        ),
      );
  };

  TelephonyGroupNumberOvhPabx.prototype.addDialplan = function addDialplan(
    dialplanOptions,
  ) {
    const self = this;
    let dialplan = find(self.dialplans, {
      dialplanId: dialplanOptions.dialplanId,
    });

    if (dialplan) {
      dialplan.setInfos(dialplanOptions);
    } else {
      dialplan = new TelephonyGroupNumberOvhPabxDialplan(
        angular.extend(dialplanOptions, {
          billingAccount: self.billingAccount,
          serviceName: self.serviceName,
        }),
      );
      self.dialplans.push(dialplan);
    }

    return dialplan;
  };

  /**
   *  Remove dialplan from list without calling API.
   */
  TelephonyGroupNumberOvhPabx.prototype.removeDialplan = function removeDialplan(
    dialplan,
  ) {
    const self = this;

    remove(self.dialplans, dialplan);

    return self;
  };

  /* ----------  SOUNDS  ----------*/

  TelephonyGroupNumberOvhPabx.prototype.getSound = function getSound(soundId) {
    const self = this;

    return find(self.sounds, {
      soundId,
    });
  };

  TelephonyGroupNumberOvhPabx.prototype.getSounds = function getSounds() {
    const self = this;

    return OvhApiTelephony.OvhPabx()
      .Sound()
      .v6()
      .query({
        billingAccount: self.billingAccount,
        serviceName: self.serviceName,
      })
      .$promise.then((soundIds) =>
        $q.all(
          map(chunk(soundIds, 50), (chunkIds) =>
            OvhApiTelephony.OvhPabx()
              .Sound()
              .v6()
              .getBatch({
                billingAccount: self.billingAccount,
                serviceName: self.serviceName,
                soundId: chunkIds,
              })
              .$promise.then((resources) => {
                map(
                  filter(
                    resources,
                    (soundOptions) => soundOptions.value !== null,
                  ),
                  'value',
                ).forEach((soundOptions) => {
                  // try to find sound with same name and without id
                  // and set new soundId (these sounds are freshly uploaded)
                  const sameFileFromName = find(self.sounds, {
                    name: soundOptions.name,
                  });
                  if (sameFileFromName && !sameFileFromName.soundId) {
                    sameFileFromName.soundId = soundOptions.soundId;
                  }
                  self.addSound(soundOptions);
                });
                return self;
              }),
          ),
        ),
      );
  };

  TelephonyGroupNumberOvhPabx.prototype.addSound = function addSound(
    soundOptions,
  ) {
    const self = this;
    let sound = null;

    if (soundOptions.soundId) {
      sound = find(self.sounds, {
        soundId: soundOptions.soundId,
      });
    }

    if (sound) {
      sound.setInfos(soundOptions);
    } else {
      sound = new TelephonyGroupNumberOvhPabxSound(
        angular.extend(soundOptions, {
          billingAccount: self.billingAccount,
          serviceName: self.serviceName,
        }),
      );
      self.sounds.push(sound);
    }

    return sound;
  };

  /**
   *  Remove sound from list.
   */
  TelephonyGroupNumberOvhPabx.prototype.removeSound = function removeSound(
    sound,
  ) {
    const self = this;

    remove(self.sounds, sound);

    return self;
  };

  /* ----------  MENUS  ----------*/

  TelephonyGroupNumberOvhPabx.prototype.getMenu = function getMenu(menu) {
    const self = this;
    const menuId =
      menu.constructor.name === 'TelephonyGroupNumberOvhPabxMenu'
        ? menu.id
        : menu;

    return find(self.menus, {
      menuId,
    });
  };

  TelephonyGroupNumberOvhPabx.prototype.getMenus = function getMenus(
    loadEntries,
  ) {
    const self = this;

    return OvhApiTelephony.OvhPabx()
      .Menu()
      .v6()
      .query({
        billingAccount: self.billingAccount,
        serviceName: self.serviceName,
      })
      .$promise.then((menuIds) =>
        $q
          .all(
            map(chunk(menuIds, 50), (chunkIds) =>
              OvhApiTelephony.OvhPabx()
                .Menu()
                .v6()
                .getBatch({
                  billingAccount: self.billingAccount,
                  serviceName: self.serviceName,
                  menuId: chunkIds,
                })
                .$promise.then((resources) => {
                  map(
                    filter(
                      resources,
                      (menuOptions) => menuOptions.value !== null,
                    ),
                    'value',
                  ).forEach((menuOptions) => {
                    self.addMenu(menuOptions);
                  });
                  return self;
                }),
            ),
          )
          .then(() => {
            const entriesPromises = [];

            // must we also load entries ?
            if (loadEntries) {
              self.menus.forEach((menu) => {
                entriesPromises.push(menu.getEntries());
              });
              return $q.all(entriesPromises);
            }

            return self;
          }),
      );
  };

  TelephonyGroupNumberOvhPabx.prototype.addMenu = function addMenu(
    menuOptionsParam,
  ) {
    const self = this;
    let menu = null;
    let menuOptions = menuOptionsParam;

    if (!menuOptions) {
      menuOptions = {};
    }

    if (menuOptions.menuId) {
      menu = find(self.menus, {
        menuId: menuOptions.menuId,
      });
    }

    if (menu) {
      menu.setInfos(menuOptions);
    } else {
      menu = new TelephonyGroupNumberOvhPabxMenu(
        angular.extend(menuOptions, {
          billingAccount: self.billingAccount,
          serviceName: self.serviceName,
        }),
      );
      self.menus.push(menu);
    }

    return menu;
  };

  /**
   *  Remove menu from list.
   */
  TelephonyGroupNumberOvhPabx.prototype.removeMenu = function removeMenu(menu) {
    const self = this;

    remove(self.menus, menu);

    return self;
  };

  /* ----------  QUEUES  ----------*/

  /**
   *  TODO FOR QUEUES
   *  Set the same philosophy as menu and sounds.
   *  Create factory and add instance of the factory inside queues array.
   */

  TelephonyGroupNumberOvhPabx.prototype.getQueue = function getQueue(queueId) {
    const self = this;

    return find(self.queues, {
      queueId,
    });
  };

  TelephonyGroupNumberOvhPabx.prototype.getQueues = function getQueues() {
    const self = this;

    return OvhApiTelephony.OvhPabx()
      .Hunting()
      .Queue()
      .v6()
      .query({
        billingAccount: self.billingAccount,
        serviceName: self.serviceName,
      })
      .$promise.then((queueIds) =>
        $q.all(
          map(chunk(queueIds, 50), (chunkIds) =>
            OvhApiTelephony.OvhPabx()
              .Hunting()
              .Queue()
              .v6()
              .getBatch({
                billingAccount: self.billingAccount,
                serviceName: self.serviceName,
                queueId: chunkIds,
              })
              .$promise.then((resources) => {
                self.queues = map(
                  filter(
                    resources,
                    (queueOptions) => queueOptions.value !== null,
                  ),
                  (queueOptionsParam) => {
                    const queueOptions = queueOptionsParam.value;
                    queueOptions.queueId = parseInt(queueOptions.queueId, 10);
                    return queueOptions;
                  },
                );
                return self;
              }),
          ),
        ),
      );
  };

  /* ----------  TTS  ----------*/

  TelephonyGroupNumberOvhPabx.prototype.getSingleTts = function getSingleTts(
    ttsId,
  ) {
    const self = this;

    return find(self.tts, {
      id: ttsId,
    });
  };

  TelephonyGroupNumberOvhPabx.prototype.getTts = function getTts() {
    const self = this;

    return OvhApiTelephony.OvhPabx()
      .Tts()
      .v6()
      .query({
        billingAccount: self.billingAccount,
        serviceName: self.serviceName,
      })
      .$promise.then((ttsIds) =>
        $q.all(
          map(chunk(ttsIds, 50), (chunkIds) =>
            OvhApiTelephony.OvhPabx()
              .Tts()
              .v6()
              .getBatch({
                billingAccount: self.billingAccount,
                serviceName: self.serviceName,
                id: chunkIds,
              })
              .$promise.then((resources) => {
                map(
                  filter(resources, (ttsOptions) => ttsOptions.value !== null),
                  'value',
                ).forEach((ttsOptions) => {
                  self.addTts(ttsOptions);
                });
                return self;
              }),
          ),
        ),
      );
  };

  TelephonyGroupNumberOvhPabx.prototype.addTts = function addTts(
    ttsOptionsParam,
  ) {
    const self = this;
    let ttsOptions = ttsOptionsParam;
    let tts = null;

    if (!ttsOptions) {
      ttsOptions = {};
    }

    if (ttsOptions.id) {
      tts = find(self.tts, {
        id: ttsOptions.id,
      });
    }

    if (tts) {
      tts.setOptions(ttsOptions);
    } else {
      tts = new TelephonyGroupNumberOvhPabxTts(
        angular.extend(ttsOptions, {
          billingAccount: self.billingAccount,
          serviceName: self.serviceName,
        }),
      );
      self.tts.push(tts);
    }

    return tts;
  };

  TelephonyGroupNumberOvhPabx.prototype.removeTts = function removeTts(tts) {
    const self = this;

    remove(self.tts, {
      id: tts.id,
    });

    return self;
  };

  /* ----------  HELPERS  ----------*/

  TelephonyGroupNumberOvhPabx.prototype.inPendingState = function inPendingState() {
    return false;
  };

  /* ----------  INITIALIZATION  ----------*/

  TelephonyGroupNumberOvhPabx.prototype.init = function init(resetCache) {
    const self = this;

    if (resetCache) {
      OvhApiTelephony.OvhPabx().resetCache();
    }

    return OvhApiTelephony.OvhPabx()
      .v6()
      .get({
        billingAccount: self.billingAccount,
        serviceName: self.serviceName,
      })
      .$promise.then((featureOptions) => self.setOptions(featureOptions));
  };

  /* -----  End of PROTOTYPE METHODS  ------*/

  return TelephonyGroupNumberOvhPabx;
};
