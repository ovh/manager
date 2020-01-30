import chunk from 'lodash/chunk';
import assignIn from 'lodash/assignIn';
import filter from 'lodash/filter';
import flatten from 'lodash/flatten';
import head from 'lodash/head';
import map from 'lodash/map';
import set from 'lodash/set';

angular
  .module('managerApp')
  .controller('PackMoveCtrl', function PackMoveCtrl(
    $scope,
    $compile,
    $state,
    $timeout,
    $translate,
    $uibModal,
    $filter,
    $q,
    $stateParams,
    REDIRECT_URLS,
    OvhApiPackXdslMove,
    Poller,
    TucToast,
    TucToastError,
    OvhApiPackXdslTask,
    OvhApiPackXdsl,
    OvhApiXdsl,
    uiCalendarConfig,
    tucValidator,
  ) {
    const self = this;
    self.validator = tucValidator;
    const taskMovePendingName = 'pendingAddressMove';
    self.moveValidationPending = false;

    this.operationAlreadyPending = false;
    this.packName = $stateParams.packName;

    this.packAdress = {
      loading: false,
      current: null,
    };

    this.testLine = {
      loading: false,
      lineNumber: null,
      canMove: false,
      performed: false,
    };

    this.method = 'number';

    this.form = {
      futureLandline: {
        lineNumber: null,
        keepLineNumber: false,
        rio: null,
      },
      currentLandline: {
        lineNumber: null,
        portLineNumber: true,
      },
      offerCode: null,
    };

    this.offer = {
      available: [],
      current: {
        isLegacy: null,
      },
      selected: null,
    };

    /**
     * Calendar configuration
     */
    this.calendarConfig = {
      selectable: true,
      timeFormat: 'HH:mm',
      displayEventEnd: true,
      header: {
        left: 'title',
        center: '',
        right: 'prev,next',
      },
      eventClick(slot) {
        set(slot, 'display', {
          day: $filter('date')(slot.data.startDate, 'dd/MM/yyyy'),
          start: $filter('date')(slot.data.startDate, 'HH:mm'),
          end: $filter('date')(slot.data.endDate, 'HH:mm'),
        });
        self.offer.meetingSlots.slot = slot;
        uiCalendarConfig.calendars.mainCalendar.fullCalendar('rerenderEvents');
      },
      eventRender(slot, element) {
        const classNames = ['ovh-pack-move-event'];
        if (
          self.offer.meetingSlots.slot &&
          self.offer.meetingSlots.slot._id === slot._id
        ) {
          classNames.push('selected');
        }
        element.attr({
          class: classNames.join(' '),
        });
      },
      eventAfterAllRender() {
        if (
          uiCalendarConfig.calendars &&
          uiCalendarConfig.calendars.mainCalendar &&
          !self.offer.meetingSlots.slot
        ) {
          uiCalendarConfig.calendars.mainCalendar.fullCalendar(
            'gotoDate',
            self.offer.selected.meetingSlots.firstSlot.startDate,
          );
        }
      },
    };

    /**
     * Move the pack !
     * The post need the poll of the task (by repost),
     * this made by recursive call of this function
     *
     * @returns {void}
     */
    function moveThePack(moveDataParam) {
      let moveData = moveDataParam;
      if (!moveData) {
        moveData = {
          keepCurrentNumber: self.form.currentLandline.portLineNumber,
          offerCode: self.offer.selected.offerCode,
          provider: self.offer.selected.provider,
        };
        if (self.offer.selected.lineNumber) {
          moveData.landline = {
            lineNumber: self.offer.selected.lineNumber,
            portLineNumber: self.form.futureLandline.keepLineNumber,
            rio: tucValidator.tucIsRio(
              self.form.futureLandline.rio,
              self.form.futureLandline.lineNumber,
            )
              ? self.form.futureLandline.rio.toUpperCase()
              : undefined,
            status: self.offer.selected.lineStatus,
            unbundling: self.offer.selected.unbundling,
          };
        } else {
          moveData.creation = {
            address: self.offer.selected.address,
            meeting: {
              fakeMeeting: self.offer.meetingSlots.fakeMeeting,
              name: self.offer.selected.contactName,
              meetingSlot: !self.offer.meetingSlots.fakeMeeting
                ? self.offer.meetingSlots.slot.data
                : undefined,
            },
          };
        }

        // The post data need to be sealed for to be exactly the same at each post
        moveData = angular.copy(moveData);

        self.moveValidationPending = true;
      }

      OvhApiPackXdslMove.v6()
        .move(
          {
            packName: $stateParams.packName,
          },
          moveData,
        )
        .$promise.then(
          (data) => {
            switch (data.status) {
              case 'pending':
                $timeout(() => {
                  moveThePack(moveData);
                }, 1000);
                break;

              case 'error':
                $translate('pack_move_cannot_validate_move', {
                  message: data.error,
                }).then((translation) => {
                  TucToast.error(translation, { hideAfter: false });
                });

                self.moveValidationError = true;
                self.moveValidationPending = false;
                self.moveValidationSuccess = false;
                break;

              default:
                $timeout(() => {
                  $state.go('telecom.packs.pack', {
                    packName: $stateParams.packName,
                  });
                }, 3000);

                self.moveValidationError = false;
                self.moveValidationPending = false;
                self.moveValidationSuccess = true;
                break;
            }
          },
          (err) => {
            const message = [];

            if (err) {
              if (err.statusText) {
                message.push(err.statusText);
              }

              if (err.data && err.data.message) {
                message.push(err.data.message);
              }
            }

            $translate('pack_move_cannot_validate_move', {
              message: message.join(' '),
            }).then((translation) => {
              TucToast.error(translation, { hideAfter: false });
            });

            self.moveValidationPending = false;
          },
        );
    }

    /**
     * Open the confirm model and then launch the move
     */
    this.openConfirmModal = function openConfirmModal() {
      if (self.moveValidationError) {
        self.moveValidationError = false;
        return;
      }

      const modal = $uibModal.open({
        animation: true,
        templateUrl:
          'app/telecom/pack/move/contract/pack-move-contract.modal.html',
        controller: 'PackMoveContractCtrl',
        controllerAs: 'PackMoveContract',
        resolve: {
          data() {
            return {
              form: self.form,
              offer: self.offer.selected,
              meeting: {
                fakeMeeting: self.offer.meetingSlots.fakeMeeting,
                slot: self.offer.meetingSlots.slot
                  ? self.offer.meetingSlots.slot.display
                  : {},
              },
              packName: $stateParams.packName,
            };
          },
        },
      });

      modal.result.then((result) => {
        if (result === true) {
          moveThePack();
        }
      });
    };

    /**
     * Test if the form is valid
     * @returns {boolean}
     */
    this.isFormValid = function isFormValid() {
      const keepLine =
        !self.form.futureLandline.keepLineNumber ||
        tucValidator.tucIsRio(
          self.form.futureLandline.rio,
          self.form.futureLandline.lineNumber,
        );
      const ftMeeting =
        self.offer.selected &&
        self.offer.meetingSlots &&
        (!self.offer.selected.meetingSlots ||
          (self.offer.selected.meetingSlots &&
            self.offer.meetingSlots.fakeMeeting) ||
          (self.offer.selected.meetingSlots &&
            !self.offer.meetingSlots.fakeMeeting &&
            self.offer.meetingSlots.slot));

      return (
        keepLine &&
        ((ftMeeting && self.offer.selected.contactName) ||
          self.method === 'number')
      );
    };

    /**
     * Compute the offers
     * @param offers
     */
    this.computeOffer = function computeOffer(offers) {
      self.testLine = {
        canMove: offers.length,
      };
      if (self.testLine.canMove) {
        self.testLine.performed = true;
        assignIn(self.offer, {
          available: offers,
          selected: head(offers),
        });
        self.offerSelected(self.offer.selected);
        self.form.futureLandline.lineNumber = self.offer.selected.lineNumber;
      } else {
        self.testLine.performed = false;
        assignIn(self.offer, {
          available: [],
          selected: null,
        });
      }
    };

    /**
     * Launched before testing eligibility
     */
    this.ongoingTest = function ongoingTest() {
      self.testLine = {
        loading: true,
        canMove: false,
        performed: false,
      };
      assignIn(self.offer, {
        available: [],
        selected: null,
      });
    };

    /**
     * Get URL of oldV6 pack move
     * @returns {string}
     */
    this.getOldV6TransfertUrl = function getOldV6TransfertUrl() {
      return REDIRECT_URLS.oldV6ServiceTransfert;
    };

    /**
     * Invoked when an offer is selected
     * @param offer
     */
    this.offerSelected = function offerSelected() {
      this.offer.meetingSlots = {
        fakeMeeting: false,
      };

      /* if no meeting available, check the fakeMeeting.
      Do not offer a check box to the user if there is no choice to make */
      if (
        !(
          this.offer.selected &&
          this.offer.selected.meetingSlots &&
          this.offer.selected.meetingSlots.meetingSlots &&
          this.offer.selected.meetingSlots.meetingSlots.length
        )
      ) {
        this.offer.meetingSlots.fakeMeeting = true;
      }
    };

    /**
     * Check if can keep line number
     * @returns {boolean}
     */
    this.canKeepLineNumber = function canKeepLineNumber() {
      const canKeep =
        this.offer.selected.portability.eligible &&
        this.offer.selected.unbundling !== 'partial';
      if (!canKeep) {
        self.form.futureLandline.keepLineNumber = false;
      }
      return canKeep;
    };

    /**
     * Check is a pending move is on-going
     * @returns {Promise}
     */
    function updateOperationAlreadyPending() {
      return OvhApiPackXdslTask.Aapi()
        .details({
          packName: $stateParams.packName,
        })
        .$promise.then(
          (data) => {
            data.forEach((task) => {
              if (task.function === taskMovePendingName) {
                self.operationAlreadyPending = true;
              }
            });
          },
          (err) => new TucToastError(err),
        );
    }

    /**
     * Check is current offer is legacy
     * @returns {Promise}
     */
    function updateIsLegacyOffer() {
      return OvhApiPackXdsl.v6()
        .get({
          packId: $stateParams.packName,
        })
        .$promise.then(
          (data) => {
            self.offer.current.isLegacy = data.capabilities.isLegacyOffer;
          },
          (err) => new TucToastError(err),
        );
    }

    /**
     * Get the current pack address
     * @returns {Promise}
     */
    function getCurrentPackAddress() {
      return $q
        .all([
          OvhApiPackXdsl.Aapi()
            .get({ packId: $stateParams.packName }, null)
            .$promise.then(
              (pack) => {
                self.packAdress.current = head(pack.services);
                return self.packAdress.current
                  ? self.packAdress.current.accessName
                  : null;
              },
              (err) => new TucToastError(err),
            ),
          OvhApiPackXdsl.Aapi()
            .getLines({ packId: $stateParams.packName }, null)
            .$promise.then(
              (lines) => {
                const currentLine = head(lines);
                self.packAdress.lineNumber = currentLine.number;
                self.packAdress.portability = currentLine.portability;
              },
              (err) => new TucToastError(err),
            ),
        ])
        .finally(() => {
          self.packAdress.loading = false;
        });
    }

    /**
     * Check if the line is slamming (meaning that customer cannot keep his phone number)
     * @return {Promise}
     */
    function isSlammingLine() {
      self.slammingCheck = true;
      return OvhApiPackXdsl.v7()
        .access()
        .execute({
          packName: $stateParams.packName,
        })
        .$promise.then((ids) =>
          $q
            .all(
              map(
                chunk(ids, 200),
                (chunkIds) =>
                  OvhApiXdsl.v7()
                    .query()
                    .batch('serviceName', [''].concat(chunkIds), ',')
                    .expand()
                    .execute().$promise,
              ),
            )
            .then((chunkResult) => flatten(chunkResult))
            .then((result) => flatten(result)),
        )
        .then((xdslLines) => {
          const slammingLines = filter(
            xdslLines,
            (xdslLine) => xdslLine.value.status === 'slamming',
          );
          self.hasSlamming = !!slammingLines.length;
          return self.hasSlamming;
        })
        .catch((err) => {
          TucToast.error($translate.instant('pack_move_slamming_error'));
          return $q.reject(err);
        })
        .finally(() => {
          self.slammingCheck = false;
        });
    }

    /**
     * Initialize the controller
     */
    function init() {
      self.packAdress = {
        loading: true,
      };
      self.loading = true;
      $q.all([
        isSlammingLine(),
        updateOperationAlreadyPending(),
        updateIsLegacyOffer(),
        getCurrentPackAddress(),
      ]).finally(() => {
        self.loading = false;
      });
      $scope.$watch('PackMove.offer.selected.portability.eligible', (value) => {
        if (!value) {
          self.form.futureLandline.keepLineNumber = false;
        }
      });
      $scope.$watch('PackMove.packAdress.portability', (value) => {
        if (!value) {
          self.form.currentLandline.portLineNumber = false;
        }
      });
    }

    init();
  });
