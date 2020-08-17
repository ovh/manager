import defaultsDeep from 'lodash/defaultsDeep';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';
import set from 'lodash/set';
import some from 'lodash/some';

import { Environment } from '@ovh-ux/manager-config';

angular
  .module('managerApp')
  .directive(
    'voipTimeConditionCalendar',
    (
      $compile,
      $timeout,
      TucToast,
      VoipTimeConditionCondition,
      uiCalendarConfig,
      VOIP_TIMECONDITION_ORDERED_DAYS,
    ) => ({
      restrict: 'EA',
      templateUrl:
        'components/telecom/telephony/timeCondition/calendar/telephony-time-condition-calendar.html',
      controller: 'voipTimeConditionCalendarCtrl',
      controllerAs: '$ctrl',
      bindToController: true,
      scope: {
        timeCondition: '=voipTimeCondition',
        options: '=?calendarOptions',
      },
      link(iScope, iElement, iAttributes, controller) {
        /*= ==============================
            =            HELPERS            =
            =============================== */

        function compileFcEvent(event, element) {
          if (event.scope) {
            event.scope.$destroy();
            set(event, 'scope', null);
          }

          set(event, 'scope', iScope.$new());
          set(event, 'scope.isPopoverOpen', false);
          element.attr({
            'data-responsive-popover':
              "'components/telecom/telephony/timeCondition/condition/edit/telephony-time-condition-condition-edit.html'",
            'data-popover-trigger': 'outsideClick',
            'data-popover-placement': 'auto right',
            'data-popover-class':
              'pretty-popover voip-time-condition-condition-edit-popover',
            'data-popover-is-open': 'isPopoverOpen',
            'data-popover-append-to-body': 'true',
          });

          $compile(element)(event.scope);
        }

        function refreshConditionFromEvent(event) {
          const conditionDropped = controller.timeCondition.getCondition(
            event.id,
          );
          if (conditionDropped) {
            conditionDropped.startEdition();
            conditionDropped.weekDay =
              VOIP_TIMECONDITION_ORDERED_DAYS[
                event.start.day() === 0
                  ? VOIP_TIMECONDITION_ORDERED_DAYS.length - 1
                  : event.start.day() - 1
              ];
            conditionDropped.timeFrom = event.start.format('HH:mm:ss');
            conditionDropped.timeTo = event.end.format('HH:mm:ss');
            conditionDropped.stopEdition();
          }
        }

        function manageEventEdit(event) {
          // set current edited condition
          set(event, 'scope.isPopoverOpen', true);
          set(
            controller,
            'conditionInEdition',
            controller.timeCondition.getCondition(event.id).startEdition(),
          );
          set(controller, 'fcEventInEdition', event);
        }

        function setEventsEditable(editableState) {
          // disable edition of all events
          uiCalendarConfig.calendars.conditionsCalendar
            .fullCalendar('clientEvents')
            .forEach((event) => {
              set(event, 'editable', editableState);
            });

          // as event editable doesn't enable/disable events resize add/remove a custom class
          // to hide resize handle...
          if (!editableState) {
            uiCalendarConfig.calendars.conditionsCalendar.addClass(
              'events-resizable-disabled',
            );
          } else {
            uiCalendarConfig.calendars.conditionsCalendar.removeClass(
              'events-resizable-disabled',
            );
          }
        }

        function getOpenedEvent() {
          return find(
            uiCalendarConfig.calendars.conditionsCalendar.fullCalendar(
              'clientEvents',
            ),
            (fcEvent) => get(fcEvent, 'scope.isPopoverOpen') === true,
          );
        }

        /* -----  End of HELPERS  ------*/

        // set calendar options
        set(
          controller,
          'options',
          defaultsDeep(controller.options || {}, {
            height: 'auto',
            locale: Environment.getUserLanguage(),
            editable: true,
            allDaySlot: false,
            allDayDefault: false,
            selectable: true,
            eventOverlap: false,
            selectOverlap: false,
            header: false,
            firstDay: 1,
            timeZone: 'local',
            columnFormat: 'dddd',
            axisFormat: 'HH:mm',
            timeFormat: 'HH:mm',
            defaultView: 'agendaWeek',
            duration: '01:00',
            snapDuration: '01:00',
            eventConstraint: {
              start: '00:00',
              end: '24:00:01',
            },
            selectConstraint: {
              start: '00:00',
              end: '24:00',
            },
            events(start, end, timeZone, callback) {
              return callback(
                map(
                  filter(
                    controller.timeCondition.conditions,
                    (condition) => condition.state !== 'TO_DELETE',
                  ),
                  (condition) =>
                    angular.extend(condition.toFullCalendarEvent(), {
                      className: condition.policy || 'available',
                    }),
                ),
              );
            },
            eventClick(event) {
              manageEventEdit(event);
            },
            eventRender(event, element) {
              compileFcEvent(event, element);

              // change event end display
              const displayTimeElem = $(element).find('.fc-time span');
              const splittedElemText = displayTimeElem.text().split('-');
              if (splittedElemText.length > 1) {
                const start = splittedElemText[0].trim();
                let end = splittedElemText[1].trim();
                const splittedEnd = end.split(':');
                if (splittedEnd.length) {
                  const endMinute = parseInt(splittedEnd[1], 10);
                  if (endMinute % 15 !== 0) {
                    end = moment()
                      .set('hour', splittedEnd[0])
                      .set('minute', splittedEnd[1])
                      .add(1, 'minute');
                    displayTimeElem.text(`${start} - ${end.format('HH:mm')}`);
                  }
                }
              }
            },
            eventAfterAllRender(fcView) {
              let fcEvent;
              const draftCondition = find(controller.timeCondition.conditions, {
                state: 'DRAFT',
              });
              if (draftCondition) {
                fcEvent = find(fcView.calendar.clientEvents(), {
                  id: draftCondition.conditionId,
                });
                if (fcEvent) {
                  $timeout(() => {
                    manageEventEdit(fcEvent);
                  });
                }
              }
            },
            select(start, end) {
              // check if there is an opened event. If so unselect and return
              let openedEvent = getOpenedEvent();
              const openedCondition = find(
                controller.timeCondition.conditions,
                {
                  inEdition: true,
                },
              );

              if (openedCondition) {
                openedEvent = find(
                  uiCalendarConfig.calendars.conditionsCalendar.fullCalendar(
                    'clientEvents',
                  ),
                  {
                    id: openedCondition.conditionId,
                  },
                );
                if (openedEvent && openedEvent.scope) {
                  openedEvent.scope.$destroy();
                }
              }

              if (openedEvent) {
                openedEvent.scope.isPopoverOpen = false;
                return uiCalendarConfig.calendars.conditionsCalendar.fullCalendar(
                  'unselect',
                );
              }
              if (controller.timeCondition.featureType === 'sip') {
                controller.timeCondition.addCondition({
                  hourBegin: start.format('HHmm'),
                  hourEnd: end.format('HHmm'),
                  day:
                    VOIP_TIMECONDITION_ORDERED_DAYS[
                      start.day() === 0
                        ? VOIP_TIMECONDITION_ORDERED_DAYS.length - 1
                        : start.day() - 1
                    ],
                  state: 'DRAFT',
                });
              } else {
                controller.timeCondition.addCondition({
                  timeFrom: start.format('HH:mm:ss'),
                  timeTo: end.format('HH:mm:ss'),
                  weekDay:
                    VOIP_TIMECONDITION_ORDERED_DAYS[
                      start.day() === 0
                        ? VOIP_TIMECONDITION_ORDERED_DAYS.length - 1
                        : start.day() - 1
                    ],
                  state: 'DRAFT',
                });
              }

              // refresh events
              uiCalendarConfig.calendars.conditionsCalendar.fullCalendar(
                'refetchEvents',
              );

              return null;
            },
            eventDragStop(event) {
              compileFcEvent(event, $(this));
            },
            eventDrop(event) {
              refreshConditionFromEvent(event);
            },
            eventResizeStop(event) {
              compileFcEvent(event, $(this));
            },
            eventResize(event) {
              refreshConditionFromEvent(event);
            },
          }),
        );

        set(controller, 'onPopoverInit', () => {
          setEventsEditable(false);
        });

        function repeatToDays({ id }, daysToRepeat, currentController) {
          function checkTimeOverload(timeToCopy, condition) {
            const timeMarginStart = moment(timeToCopy.timeFrom, 'HH:mm');
            const timeMarginEnd = moment(timeToCopy.timeTo, 'HH:mm');
            const conditionTimeFrom = moment(condition.timeFrom, 'HH:mm');
            const conditionTimeTo = moment(condition.timeTo, 'HH:mm');

            // First, we check if condtion time span is not between the source time
            // condition to copy,
            // and after if the source time won't overload the condition
            return (
              conditionTimeFrom.isBetween(
                timeMarginStart,
                timeMarginEnd,
                'hour',
              ) ||
              conditionTimeTo.isBetween(
                timeMarginStart,
                timeMarginEnd,
                'hour',
              ) ||
              (conditionTimeFrom.isSameOrBefore(timeMarginEnd) &&
                conditionTimeTo.isSameOrAfter(timeMarginStart))
            );
          }

          const timeConditionToCopy = currentController.timeCondition.conditions.find(
            ({ conditionId }) => conditionId === id,
          );

          const newTimeConditions = daysToRepeat
            .filter(({ name }) => {
              const existingTime = currentController.timeCondition.conditions.find(
                (condition) =>
                  condition.weekDay === name &&
                  checkTimeOverload(timeConditionToCopy, condition),
              );
              return name !== timeConditionToCopy.weekDay && !existingTime;
            })
            .map(({ name }) => {
              const copyTimeCondition = angular.copy(timeConditionToCopy);
              copyTimeCondition.conditionId = null;

              const dayToAdd = new VoipTimeConditionCondition(
                copyTimeCondition,
              );
              dayToAdd.weekDay = name;
              dayToAdd.state = 'TO_CREATE';
              return dayToAdd;
            });

          newTimeConditions.forEach((timeCondition) =>
            currentController.timeCondition.conditions.push(timeCondition),
          );
        }

        set(
          controller,
          'onPopoverValidate',
          (fcEvent, daysToRepeat, currentController) => {
            set(fcEvent, 'scope.isPopoverOpen', false);

            if (daysToRepeat.length > 0) {
              repeatToDays(fcEvent, daysToRepeat, currentController);
            }
            uiCalendarConfig.calendars.conditionsCalendar.fullCalendar(
              'refetchEvents',
            );
          },
        );

        set(controller, 'onPopoverDestroy', (fcEvent) => {
          set(fcEvent, 'editable', true);
          set(fcEvent, 'scope.isPopoverOpen', false);

          const isConditionInEdition = some(
            controller.timeCondition.conditions,
            {
              inEdition: true,
            },
          );

          if (!isConditionInEdition) {
            uiCalendarConfig.calendars.conditionsCalendar.fullCalendar(
              'refetchEvents',
            );
            setEventsEditable(true);
          }
        });
      },
    }),
  );
