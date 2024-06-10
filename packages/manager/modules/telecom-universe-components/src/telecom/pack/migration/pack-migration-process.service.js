import angular from 'angular';
import assign from 'lodash/assign';
import forEach from 'lodash/forEach';
import filter from 'lodash/filter';
import includes from 'lodash/includes';
import keyBy from 'lodash/keyBy';
import map from 'lodash/map';
import set from 'lodash/set';
import values from 'lodash/values';

import { OPTION_NAME, DICTIONNARY } from './pack-migration-process.constant';

/**
 *  Service used to share data between differents steps of the pack migration process.
 */
export default /* @ngInject */ function($q, OvhApiPackXdsl, Poller) {
  const self = this;
  let migrationProcess = null;

  self.status = {
    init: false,
    migrate: false,
    success: false,
  };

  self.currentPack = {};

  /*= ==============================
    =            PROCESS            =
    =============================== */

  self.getMigrationProcess = function getMigrationProcess() {
    return migrationProcess;
  };

  /* -----  End of PROCESS  ------*/

  /*= ==============================
    =            HELPERS            =
    =============================== */

  self.getPriceStruct = function getPriceStruct(value) {
    // pack will be our model to build price struct
    return {
      currencyCode: migrationProcess.pack.offerPrice.currencyCode,
      text: migrationProcess.pack.offerPrice.text.replace(
        /\d+(?:[.,]\d+)?/,
        value.toFixed(2),
      ),
      value,
    };
  };

  self.getOptionsSelected = function getOptionsSelected() {
    return filter(
      values(migrationProcess.selectedOffer.options),
      (option) =>
        (option.optional && option.choosedValue > 0) ||
        option.selected === true,
    );
  };

  /* -----  End of HELPERS  ------*/

  /*= =======================================
    =            TASKS MANAGEMENT            =
    ======================================== */

  function getMigrationTaskByStatus(taskStatus) {
    return OvhApiPackXdsl.Task()
      .v6()
      .query({
        packName: migrationProcess.pack.packName,
        function: 'pendingMigration',
        status: taskStatus,
      }).$promise;
  }

  self.checkForPendingMigration = function checkForPendingMigration() {
    return $q
      .all({
        todo: getMigrationTaskByStatus('todo'),
        doing: getMigrationTaskByStatus('doing'),
      })
      .then((tasksIds) => tasksIds.todo.concat(tasksIds.doing));
  };

  self.startMigration = function startMigration() {
    const postParams = {
      acceptContracts: true,
      offerName: migrationProcess.selectedOffer.offerName,
    };

    // options post params
    const migrationOptions = map(self.getOptionsSelected(), (option) => ({
      name: option.name,
      quantity: option.choosedValue || (option.selected === true ? 1 : 0),
    }));

    postParams.options = migrationOptions;

    assign(postParams, {
      productCode: migrationProcess.selectedOffer.productCode,
    });

    // shipping post params
    if (
      migrationProcess.selectedOffer.needNewModem &&
      migrationProcess.shipping.mode === 'mondialRelay'
    ) {
      postParams.mondialRelayId = migrationProcess.shipping.relay.id;
    } else if (
      migrationProcess.selectedOffer.needNewModem &&
      migrationProcess.shipping.mode === 'transporter'
    ) {
      postParams.nicShipping = migrationProcess.shipping.address.id;
    }

    // sub service to delete post params
    if (migrationProcess.selectedOffer.subServicesToDelete.length) {
      postParams.subServicesToDelete = [];
      postParams.subServicesToKeep = [];
      migrationProcess.selectedOffer.subServicesToDelete.forEach(
        (subService) => {
          postParams.subServicesToDelete = postParams.subServicesToDelete.concat(
            map(
              filter(subService.services, {
                selected: false,
              }),
              (service) => ({
                service: service.name,
                type: subService.type,
              }),
            ),
          );
          postParams.subServicesToKeep = postParams.subServicesToKeep.concat(
            map(
              filter(subService.services, {
                selected: true,
              }),
              (service) => ({
                service: service.name,
                type: subService.type,
              }),
            ),
          );
        },
      );
    }

    // building details post params
    assign(postParams, {
      buildingReference: migrationProcess.selectedOffer.buildingReference,
      stair: migrationProcess.selectedOffer.stair,
      floor: migrationProcess.selectedOffer.floor,
    });

    // OTP post params
    assign(postParams, {
      otp: migrationProcess.selectedOffer.pto,
    });

    if (
      migrationProcess.selectedOffer.pto &&
      migrationProcess.selectedOffer.ptoReference
    ) {
      assign(postParams, {
        otpReference: migrationProcess.selectedOffer.ptoReference,
      });
    }

    // Installation type post params
    if (migrationProcess.selectedOffer.pto) {
      assign(postParams, {
        installationType:
          DICTIONNARY[migrationProcess.selectedOffer.selectedPto],
      });
    }

    // Set contact phone if is set
    if (migrationProcess.contactPhone) {
      Object.assign(postParams, {
        contactPhone: migrationProcess.contactPhone,
      });
    }

    // Set modem
    assign(postParams, {
      modem: migrationProcess.selectedOffer.modem,
    });

    // Set meeting
    if (migrationProcess.selectedOffer.meetingSlots?.slot) {
      const meeting = {
        fakeMeeting: migrationProcess.selectedOffer.meetingSlots.fakeMeeting,
        meetingSlot: {
          endDate: migrationProcess.selectedOffer.meetingSlots.slot.endDate,
          startDate: migrationProcess.selectedOffer.meetingSlots.slot.startDate,
          uiCode: migrationProcess.selectedOffer.meetingSlots.slot.uiCode,
          slotId: migrationProcess.selectedOffer.meetingSlots.slot.slotId,
        },
        name: migrationProcess.selectedOffer.contactName,
      };
      assign(postParams, {
        meeting,
      });
    }

    return OvhApiPackXdsl.v6().migrate(
      {
        packName: migrationProcess.pack.packName,
      },
      postParams,
    ).$promise;
  };

  self.startTaskPolling = function startTaskPolling() {
    return Poller.poll(
      [
        '/pack/xdsl',
        migrationProcess.pack.packName,
        'tasks',
        migrationProcess.migrationTaskId,
      ].join('/'),
      null,
      {
        namespace: 'xdsl_pack_migration',
      },
    );
  };

  self.stopTaskPolling = function stopTaskPolling() {
    Poller.kill({
      namespace: 'xdsl_pack_migration',
    });
  };

  /* -----  End of TASKS MANAGEMENT  ------*/

  /*= ===================================
    =            CURRENT PACK            =
    ==================================== */

  function getPackService() {
    return OvhApiPackXdsl.v6()
      .get({
        packId: migrationProcess.pack.packName,
      })
      .$promise.then((serviceDetails) => {
        angular.extend(migrationProcess.pack, serviceDetails);
      });
  }

  function getPackOptions() {
    return OvhApiPackXdsl.v6()
      .getServices({
        packId: migrationProcess.pack.packName,
      })
      .$promise.then((packOptions) => {
        migrationProcess.pack.options = keyBy(packOptions, 'name');
      });
  }

  /**
   * Retrieve contact owner associated to the pack if it exists
   */
  function getCurrentContactOwner() {
    migrationProcess.contactOwner = null;
    return OvhApiPackXdsl.v6()
      .getContactOwner({
        packName: migrationProcess.pack.packName,
      })
      .$promise.then((result) => {
        migrationProcess.contactOwner = result.data;
        migrationProcess.contactPhone = migrationProcess.contactOwner?.phone;
      });
  }

  function getPackDetails() {
    return $q.allSettled([
      getPackService(),
      getPackOptions(),
      getCurrentContactOwner(),
    ]);
  }

  /* -----  End of CURRENT PACK  ------*/

  /*= =============================
    =            OFFERS            =
    ============================== */

  function getMigrationOffers() {
    let params = {};
    if (migrationProcess.selectedBuilding) {
      params = {
        buildingReference: migrationProcess.selectedBuilding.reference,
      };
    }
    return Poller.poll(
      ['/pack/xdsl', migrationProcess.pack.packName, 'migration/offers'].join(
        '/',
      ),
      null,
      {
        postData: params,
        successRule: {
          status(elem) {
            return elem.status === 'error' || elem.status === 'ok';
          },
        },
        method: 'post',
      },
    ).then((pollResult) => {
      if (!pollResult.error) {
        set(
          pollResult,
          'result.offers',
          map(pollResult.result.offers, (offer) => {
            set(offer, 'displayedPrice', offer.price);
            set(offer, 'gtrComfortActivated', false);
            set(offer, 'totalSubServiceToDelete', 0);
            forEach(offer.subServicesToDelete, (subService) => {
              // eslint-disable-next-line no-param-reassign
              offer.totalSubServiceToDelete += subService.numberToDelete;
              return offer.totalSubServiceToDelete;
            });
            angular.forEach(offer.subServicesToDelete, (subService) => {
              set(
                subService,
                'services',
                map(subService.services, (service, index, originalArray) => ({
                  name: service,
                  selected: originalArray.length === subService.numberToDelete,
                })),
              );
            });
            const voipOptions = offer.options
              .filter((option) => option.name === OPTION_NAME)
              .reduce((acc, option) => {
                set(acc, `${option.name}_${option.optional}`, option);
                return acc;
              }, {});
            let otherOptions = offer.options.filter(
              (option) => option.name !== OPTION_NAME,
            );
            otherOptions = keyBy(otherOptions, 'name');
            set(offer, 'options', { ...otherOptions, ...voipOptions });
            set(offer, 'buildings', pollResult.result.buildings);
            return offer;
          }),
        );
      }
      migrationProcess.migrationOffers = pollResult;
    });
  }

  self.initOffersView = function initOffersView() {
    return $q
      .all({
        pack: getPackDetails(),
        offers: getMigrationOffers(),
      })
      .then(() => migrationProcess);
  };

  self.selectOffer = function selectOffer(offer) {
    migrationProcess.selectedOffer = offer;
    if (
      !migrationProcess.pack.offerDescription
        .toLowerCase()
        .match(/ftth|fibre|fiber/) &&
      includes(migrationProcess.selectedOffer.offerName.toLowerCase(), 'fiber')
    ) {
      migrationProcess.currentStep = 'buildingDetails';
    } else if (migrationProcess.selectedOffer.totalSubServiceToDelete > 0) {
      migrationProcess.currentStep = 'serviceDelete';
    } else if (migrationProcess.selectedOffer.needNewModem) {
      migrationProcess.currentStep = 'shipping';
    } else if (migrationProcess.selectedOffer.needMeeting) {
      migrationProcess.currentStep = 'meeting';
    } else {
      migrationProcess.currentStep = 'confirm';
    }
  };

  /* -----  End of OFFERS  ------*/

  /*= ==============================
    =         Buildings            =
    ================================ */
  self.setSelectedBuilding = function setSelectedBuilding(building) {
    migrationProcess.selectedBuilding = building;
  };

  self.setBuildings = function setBuildings(buildings) {
    migrationProcess.buildings = buildings;
  };

  /*= ===============================
    =          Meeting              =
    ================================= */
  self.setSelectedMeeting = function setSelectedMeeting(
    meetingSlots,
    contactName,
  ) {
    migrationProcess.selectedOffer.contactName = contactName;
    migrationProcess.selectedOffer.meetingSlots = meetingSlots;
    migrationProcess.currentStep = 'confirm';
  };

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  self.cancelMigration = function cancelMigration() {
    migrationProcess.shipping = {
      mode: null,
      relay: null,
      address: null,
    };

    migrationProcess.currentStep = 'offers';
    migrationProcess.selectedOffer = null;
  };

  self.init = function init(packName) {
    migrationProcess = {
      pack: {
        packName,
      },
      shipping: {
        mode: null,
        relay: null,
        address: null,
      },
      migrationOffers: null,
      currentStep: '',
      selectedOffer: null,
      buildings: null,
      selectedBuilding: null,
      contactPhone: null,
    };
    return migrationProcess;
  };

  /* -----  End of INITIALIZATION  ------*/
}
