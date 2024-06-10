import has from 'lodash/has';
import { FIBER_PTO, STAIR_FLOOR } from './migration-building-details.constant';

export default class TelecomPackMigrationBuildingDetailsCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $translate,
    TucPackMigrationProcess,
    TucToast,
    OvhApiConnectivityEligibilitySearch,
  ) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.TucPackMigrationProcess = TucPackMigrationProcess;
    this.TucToast = TucToast;
    this.OvhApiConnectivityEligibilitySearch = OvhApiConnectivityEligibilitySearch;
  }

  /*= =====================================
  =            INITIALIZATION            =
  ====================================== */
  $onInit() {
    this.process = null;
    this.loading = {
      init: true,
    };
    this.model = {
      engageMonths: null,
      selectedBuilding: null,
      selectedStair: null,
      selectedFloor: null,
      pto: null,
      ptoReference: null,
      ptoReferenceNotKnown: false,
    };

    this.FIBER_PTO = FIBER_PTO;

    this.process = this.TucPackMigrationProcess.getMigrationProcess();
    this.isMultiOtpAvailable = this.process.selectedOffer.multiOtp;

    const building = this.process.selectedBuilding;

    this.OvhApiConnectivityEligibilitySearch.v6()
      .pollerBuildingDetails(this.$scope, { building: building.reference })
      .then((buildingDetails) => {
        if (has(buildingDetails, 'result.stairs')) {
          this.process.selectedBuilding.stairs = buildingDetails.result.stairs.map(
            (stair) => this.convertStairs(stair),
          );
        }
      })
      .catch(() =>
        this.TucToast.error(
          this.$translate.instant(
            'telecom_pack_migration_building_details_error',
          ),
        ),
      )
      .finally(() => {
        this.model.selectedBuilding = building;
        this.changeSelection();
        this.loading.init = false;
      });
  }

  /* -----  End of INITIALIZATION  ------*/

  /*= ==============================
  =            ACTIONS            =
  =============================== */

  cancelMigration() {
    this.TucPackMigrationProcess.cancelMigration();
  }

  nextStep() {
    this.process.selectedOffer.buildingReference = this.model.selectedBuilding.reference;
    this.process.selectedOffer.stair = this.model.selectedStair.stair.value;
    this.process.selectedOffer.floor = this.model.selectedFloor.value;

    this.process.selectedOffer.pto = [
      FIBER_PTO.FIBER_PTO_YES,
      FIBER_PTO.FIBER_PTO_YES_BUT_NOT_KNOWN,
      FIBER_PTO.FIBER_PTO_MULTI_OTP,
    ].includes(this.model.pto);
    this.process.selectedOffer.selectedPto = this.model.pto;
    this.process.selectedOffer.ptoReference =
      this.model.pto === FIBER_PTO.FIBER_PTO_YES
        ? this.model.ptoReference
        : null;

    if (this.process.selectedOffer.totalSubServiceToDelete > 0) {
      this.process.currentStep = 'serviceDelete';
    } else if (this.process.selectedOffer.needNewModem) {
      this.process.currentStep = 'shipping';
    } else if (this.process.selectedOffer.needMeeting) {
      this.process.currentStep = 'meeting';
    } else {
      this.process.currentStep = 'confirm';
    }
  }

  /* Check OTP reference value is valid */
  isOtpRegexValid() {
    this.otpReferenceValid = true;
    if (
      this.model.pto === FIBER_PTO.FIBER_PTO_YES ||
      (this.model.pto === FIBER_PTO.FIBER_PTO_MULTI_OTP &&
        this.model.ptoReference)
    ) {
      this.otpReferenceValid = this.model.ptoReference?.match(
        /^[A-Z]{2}-[A-Z\d]{4}-[A-Z\d]{4}$/,
      );
    }
  }

  isValidSelection() {
    if (
      this.model.selectedBuilding != null &&
      this.model.selectedStair != null &&
      this.model.selectedFloor != null &&
      this.model.pto != null
    ) {
      return (
        (this.model.pto === FIBER_PTO.FIBER_PTO_YES &&
          this.otpReferenceValid) ||
        [
          FIBER_PTO.FIBER_PTO_YES_BUT_NOT_KNOWN,
          FIBER_PTO.FIBER_PTO_NO,
          FIBER_PTO.FIBER_PTO_MULTI_OTP,
        ].includes(this.model.pto)
      );
    }
    return false;
  }

  isPto() {
    this.isOtpRegexValid();
    return [FIBER_PTO.FIBER_PTO_YES, FIBER_PTO.FIBER_PTO_MULTI_OTP].includes(
      this.model.pto,
    );
  }

  convertStairs(stair) {
    const stairsModel = {};
    if (
      stair.stair === STAIR_FLOOR.unknown ||
      stair.stair === STAIR_FLOOR.buildingUnknown
    ) {
      stairsModel.stair = {
        label: this.$translate.instant(
          'telecom_pack_migration_building_details_none',
        ),
        value: stair.stair,
      };
    } else {
      stairsModel.stair = {
        label: stair.stair,
        value: stair.stair,
      };
    }

    if (stair.floors[0] === STAIR_FLOOR.unknown) {
      stairsModel.floors = [
        {
          label: this.$translate.instant(
            'telecom_pack_migration_building_details_none',
          ),
          value: stair.floors[0],
        },
      ];
    } else {
      stairsModel.floors = stair.floors.map((floor) => ({
        label: floor,
        value: floor,
      }));
    }
    return stairsModel;
  }

  /**
   * Set default stairs model for empty stairs
   */
  defaultStairsModel() {
    return {
      stair: {
        label: this.$translate.instant(
          'telecom_pack_migration_building_details_none',
        ),
        value: STAIR_FLOOR.unknown,
      },
      floors: [
        {
          label: this.$translate.instant(
            'telecom_pack_migration_building_details_none',
          ),
          value: STAIR_FLOOR.unknown,
        },
      ],
    };
  }

  changeSelection(isFromStairs) {
    if (!isFromStairs) {
      if (this.model.selectedBuilding.stairs.length === 0) {
        this.OvhApiConnectivityEligibilitySearch.v6()
          .pollerBuildingDetails(this.$scope, {
            building: this.model.selectedBuilding.reference,
          })
          .then((buildingDetails) => {
            if (has(buildingDetails, 'result.stairs')) {
              if (buildingDetails.result.stairs.length === 0) {
                const stairModel = this.defaultStairsModel();
                this.model.selectedBuilding.stairs.push(stairModel);
              } else {
                this.model.selectedBuilding.stairs = buildingDetails.result.stairs.map(
                  (stair) => this.convertStairs(stair),
                );
              }
            }
          });
      }
      if (this.model.selectedStair != null) {
        this.model.selectedStair = null;
      }
      if (this.model.selectedFloor != null) {
        this.model.selectedFloor = null;
      }
    } else {
      this.model.selectedFloor = null;
    }
  }

  /* -----  End of ACTIONS  ------*/
}
