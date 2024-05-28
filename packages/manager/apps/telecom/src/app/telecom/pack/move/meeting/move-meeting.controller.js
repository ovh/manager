import get from 'lodash/get';

export default class MoveMeetingCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $translate,
    OvhApiConnectivityEligibilitySearch,
    TucToast,
  ) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.OvhApiConnectivityEligibilitySearch = OvhApiConnectivityEligibilitySearch;
    this.TucToast = TucToast;
  }

  $onInit() {
    this.offer = {
      meetingSlots: {
        fakeMeeting: false,
        slot: null,
      },
      selected: {
        contactName: null,
      },
    };

    this.showMeetingSlots = false;
    this.meetingSlots = {};

    this.noMeetingAvailable = false;

    this.loading = true;
    this.meetings = [];
    return this.OvhApiConnectivityEligibilitySearch.v6()
      .searchMeetings(this.$scope, {
        eligibilityReference: this.eligibilityReference,
        productCode: this.productCode,
      })
      .then((data) => {
        if (data.result) {
          this.meetingSlots.canBookFakeMeeting = data.result.canBookFakeMeeting;
          this.meetingSlots.slots = data.result.meetingSlots;

          let slots = [];
          let prevTitle;
          data.result.meetingSlots.forEach((slot, index) => {
            const title = moment(slot.startDate).format('ddd DD MMM YYYY');
            if (!prevTitle) {
              prevTitle = title;
            } else if (prevTitle !== title) {
              this.meetings.push({
                title: prevTitle,
                slots,
              });
              slots = [];
              prevTitle = title;
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
          if (this.meetings.length === 0 && prevTitle) {
            // Push slots if only one date available
            this.meetings.push({
              title: prevTitle,
              slots,
            });
          }
          this.showMeetingSlots = true;
          this.meetingSelectMessage = '';
        } else {
          this.noMeetingAvailable = true;
        }
      })
      .catch((error) => {
        this.TucToast.error(
          `${this.$translate.instant('pack_move_meeting_error')} ${get(
            error,
            'data.message',
            '',
          )}`,
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  checkConfirm() {
    const checkContact = !!this.contactName;
    const checkSlot = this.offer.meetingSlots.slot !== null;
    return !(checkContact && checkSlot) && !this.noMeetingAvailable;
  }

  selectSlot(slotId) {
    this.offer.meetingSlots.fakeMeeting = this.meetingSlots.canBookFakeMeeting;
    this.offer.meetingSlots.slot = this.meetingSlots.slots[slotId];

    const day = moment(this.offer.meetingSlots.slot.startDate).format(
      'DD/MM/YYYY',
    );
    const start = moment(this.offer.meetingSlots.slot.startDate).format(
      'HH:mm',
    );
    const end = moment(this.offer.meetingSlots.slot.endDate).format('HH:mm');
    this.meetingSelectMessage = this.$translate.instant(
      'pack_move_programmed_meeting',
      { day, start, end },
    );
  }

  next() {
    this.offer.selected.contactName = this.contactName;
    this.$scope.$emit('selectMeeting', this.offer);
  }
}
