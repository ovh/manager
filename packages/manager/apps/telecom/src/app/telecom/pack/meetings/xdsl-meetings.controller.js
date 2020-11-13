import get from 'lodash/get';

export default class XdslMeetingCtrl {
  /* @ngInject */
  constructor($translate, OvhApiXdsl) {
    this.$translate = $translate;
    this.OvhApiXdsl = OvhApiXdsl;
  }

  $onInit() {
    this.select = {
      meetingSlots: {
        fakeMeeting: false,
        slot: null,
      },
    };

    this.showMeetingSlots = false;

    if (this.meetings.length > 0) {
      this.showMeetingSlots = true;
    }
  }

  checkConfirm() {
    return this.select.meetingSlots.slot !== null;
  }

  selectSlot(slotId) {
    this.select.meetingSlots.fakeMeeting = this.meetingSlots.canBookFakeMeeting;
    this.select.meetingSlots.slot = this.meetingSlots.slots[slotId];

    this.meetingSelectMessage = this.$translate.instant(
      'xdsl_meeting_programmed_meeting',
      {
        day: `<strong>${this.getDay()}</strong>`,
        start: `<strong>${this.getStart()}</strong>`,
        end: `<strong>${this.getEnd()}</strong>`,
      },
    );
  }

  getDay() {
    const day = moment(this.select.meetingSlots.slot.startDate).format(
      'DD/MM/YYYY',
    );
    return day;
  }

  getStart() {
    const start = moment(this.select.meetingSlots.slot.startDate).format(
      'HH:mm',
    );
    return start;
  }

  getEnd() {
    const end = moment(this.select.meetingSlots.slot.endDate).format('HH:mm');
    return end;
  }

  orderMeeting() {
    return this.OvhApiXdsl.v6()
      .orderMeeting(
        {
          serviceName: this.serviceName,
        },
        {
          endDate: this.select.meetingSlots.slot.endDate,
          startDate: this.select.meetingSlots.slot.startDate,
          uiCode: this.select.meetingSlots.slot.uiCode,
        },
      )
      .$promise.then(() => {
        this.successMessage = this.$translate.instant(
          'xdsl_meeting_order_succeed',
          {
            day: `<strong>${this.getDay()}</strong>`,
            start: `<strong>${this.getStart()}</strong>`,
            end: `<strong>${this.getEnd()}</strong>`,
          },
        );
      })
      .catch((error) => {
        this.errorMessage = this.$translate.instant(
          'xdsl_meeting_order_error',
          {
            day: `<strong>${this.getDay()}</strong>`,
            start: `<strong>${this.getStart()}</strong>`,
            end: `<strong>${this.getEnd()}</strong>`,
            error: get(error, 'data.message'),
          },
        );
      });
  }
}
