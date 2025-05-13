export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.xdsl-meetings', {
    url: '/xdsl/:serviceName/meetings',
    views: {
      'telecomView@telecom': 'packXdslMeetings',
    },
    resolve: {
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      loadMeetings: /* @ngInject */ ($rootScope, OvhApiXdsl, serviceName) => {
        return OvhApiXdsl.v6().searchOrderMeetings($rootScope, {
          serviceName,
        });
      },
      meetingSlots: /* @ngInject */ (loadMeetings) => {
        const { result, error } = loadMeetings;
        if (result) {
          return {
            slots: result.meetingSlots,
          };
        }

        if (error) {
          return {
            errorMessage: error,
          };
        }
        return null;
      },
      meetings: /* @ngInject */ (meetingSlots) => {
        const meetings = [];

        let slots = [];
        let prevTitle;
        if (meetingSlots.slots) {
          meetingSlots.slots.forEach((slot, index) => {
            const title = moment(slot.startDate).format('ddd DD MMM YYYY');
            if (!prevTitle) {
              prevTitle = title;
            } else if (prevTitle !== title) {
              meetings.push({
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
            });
          });
        }

        return meetings;
      },
      hideBreadcrumb: () => true,
    },
  });
};
