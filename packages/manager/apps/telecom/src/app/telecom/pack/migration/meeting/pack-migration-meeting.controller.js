import get from 'lodash/get';

export default class TelecomPackMigrationMeetingCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $translate,
    OvhApiConnectivityEligibility,
    OvhApiConnectivityEligibilitySearch,
    TucPackMigrationProcess,
    TucToast,
  ) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.ovhApiConnectivityEligibility = OvhApiConnectivityEligibility;
    this.ovhApiConnectivityEligibilitySearch = OvhApiConnectivityEligibilitySearch;
    this.tucPackMigrationProcess = TucPackMigrationProcess;
    this.tucToast = TucToast;
  }

  $onInit() {
    this.selectedMeeting = {
      meetingSlots: {
        fakeMeeting: false,
        slot: null,
      },
    };
    this.contactName = null;
    this.showMeetingSlots = false;
    this.meetingSlots = {};

    this.process = this.tucPackMigrationProcess.getMigrationProcess();
    this.buildingReference = this.process.selectedOffer.buildingReference;

    this.loading = true;
    this.meetings = [];
    return this.ovhApiConnectivityEligibility
      .v6()
      .testBuilding(this.$scope, { building: this.buildingReference })
      .then((eligibility) => {
        if (eligibility.result) {
          const { eligibilityReference } = eligibility.result;
          const productCode = eligibility.result.offers[0].product.code;
          this.process.selectedOffer.address =
            eligibility.result.endpoint.address;
          this.process.selectedOffer.productCode = productCode;
          return this.ovhApiConnectivityEligibilitySearch
            .v6()
            .searchMeetings(this.$scope, {
              eligibilityReference,
              productCode,
            })
            .then((data) => {
              if (data.result) {
                this.meetingSlots.canBookFakeMeeting =
                  data.result.canBookFakeMeeting;
                this.meetingSlots.slots = data.result.meetingSlots;

                let slots = [];
                let previousTitle;
                data.result.meetingSlots.forEach((slot, index) => {
                  const title = moment(slot.startDate).format(
                    'ddd DD MMM YYYY',
                  );
                  if (!previousTitle) {
                    previousTitle = title;
                  } else if (previousTitle !== title) {
                    this.meetings.push({
                      title: previousTitle,
                      slots,
                    });
                    slots = [];
                    previousTitle = title;
                  }
                  slots.push({
                    id: index,
                    start: slot.startDate,
                    end: slot.endDate,
                    startTime: moment(slot.startDate).format('HH:mm'),
                    endTime: moment(slot.endDate).format('HH:mm'),
                    selected: false,
                    slotId: slot.slotId,
                  });
                });
                if (this.meetings.length === 0 && previousTitle) {
                  // Push slots if only one date available
                  this.meetings.push({
                    title: previousTitle,
                    slots,
                  });
                }
                this.showMeetingSlots = true;
                this.meetingSelectMessage = '';
              }
            });
        }
        return null;
      })
      .catch((error) => {
        this.tucToast.error(
          `${this.$translate.instant(
            'telecom_pack_migration_meeting_error',
          )} ${get(error, 'data.message', '')}`,
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  checkConfirm() {
    const checkContact = !!this.contactName;
    const checkSlot = this.selectedMeeting.meetingSlots.slot !== null;
    return !(checkContact && checkSlot);
  }

  selectSlot(slotId) {
    this.selectedMeeting.meetingSlots.fakeMeeting = this.meetingSlots.canBookFakeMeeting;
    this.selectedMeeting.meetingSlots.slot = this.meetingSlots.slots[slotId];

    const { startDate, endDate } = this.selectedMeeting.meetingSlots.slot;
    const day = moment(startDate).format('DD/MM/YYYY');
    const start = moment(startDate).format('HH:mm');
    const end = moment(endDate).format('HH:mm');
    this.meetingSelectMessage = this.$translate.instant(
      'telecom_pack_migration_programmed_meeting',
      {
        day: `<strong>${day}</strong>`,
        start: `<strong>${start}</strong>`,
        end: `<strong>${end}</strong>`,
      },
    );
  }

  nextStep() {
    this.tucPackMigrationProcess.setSelectedMeeting(
      this.selectedMeeting.meetingSlots,
      this.contactName,
    );
  }
}
