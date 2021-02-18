import find from 'lodash/find';
import get from 'lodash/get';
import isString from 'lodash/isString';
import map from 'lodash/map';
import filter from 'lodash/filter';

import bankHolidaysTemplate from './actions/bankHolidays/bank-holidays.html';
import bankHolidaysController from './actions/bankHolidays/bank-holidays.controller';

import deleteAllTemplate from './actions/deleteAll/delete-all.html';
import deleteAllController from './actions/deleteAll/delete-all.controller';

import exportTemplate from './actions/export/export.html';
import exportController from './actions/export/export.controller';

import importTemplate from './actions/import/import.html';
import importController from './actions/import/import.controller';

export default /* @ngInject */ function TelephonySchedulerCtrl(
  $anchorScroll,
  $locale,
  $location,
  $q,
  $translate,
  $translatePartialLoader,
  $uibModal,
  matchmedia,
  OvhApiTelephony,
  OvhApiMe,
  Poller,
  TucToast,
  uiCalendarConfig,
  VoipSchedulerEvent,
) {
  const self = this;

  self.loading = {
    init: false,
    filters: false,
    params: false,
    translations: false,
    save: false,
    events: false,
    edit: false,
    refresh: false,
    import: false,
    deleteAll: false,
  };

  self.model = {
    currentView: 'month',
    filters: {},
    events: [],
  };

  self.status = {
    displayActions: false,
    deleteConfirm: false,
    isDesktop: false,
  };

  self.calendarOptions = null;

  /*= ==============================
    =            HELPERS            =
    =============================== */

  self.fetchEvents = function fetchEvents(start, end) {
    self.loading.events = true;

    return self.scheduler
      .getEvents({
        'dateStart.from': start.format(),
        'dateEnd.to': end.format(),
      })
      .then((events) => events)
      .catch((error) => {
        TucToast.error(
          [
            $translate.instant('telephony_scheduler_load_error'),
            (error.data && error.data.message) || '',
          ].join(' '),
        );
        return $q.reject(error);
      })
      .finally(() => {
        self.loading.events = false;
      });
  };

  self.applyFilters = function applyFilters(events) {
    return map(
      filter(
        events,
        (event) =>
          event.status !== 'TODELETE' &&
          (self.model.filters.categories
            ? self.model.filters.categories.indexOf(event.categories) === -1
            : true),
      ),
      (event) =>
        angular.extend(event.toFullCalendarEvent(), {
          className: event.categories,
        }),
    );
  };

  self.getCalendarTitle = function getCalendarTitle() {
    return $(uiCalendarConfig.calendars.eventsCalendar).fullCalendar('getView')
      .title;
  };

  self.getCurrentDay = function getCurrentDay() {
    return moment().format('DD');
  };

  self.hasEventInEdition = function hasEventInEdition() {
    return !!find(self.scheduler.events, {
      inEdition: true,
    });
  };

  self.hasChange = function hasChange() {
    return (
      self.scheduler.hasChange() ||
      (self.timeCondition && self.timeCondition.hasChange())
    );
  };

  /* ----------  Import task polling  ----------*/

  function startImportTaskPolling(taskId) {
    return Poller.poll(
      [
        '/telephony',
        self.scheduler.billingAccount,
        'service',
        self.scheduler.serviceName,
        'task',
        taskId,
      ].join('/'),
      {
        cache: false,
      },
      {
        namespace: `importIcs_${self.scheduler.serviceName}`,
        interval: 1000,
        retryMaxAttempts: 0,
      },
    );
  }

  /* -----  End of HELPERS  ------*/

  /*= ==============================
    =            ACTIONS            =
    =============================== */

  /* ----------  Scheduler actions  ----------*/

  self.cancelEdition = function cancelEdition() {
    // stop the scheduler edition
    self.scheduler.stopEdition(true, false, true).startEdition();

    // stop the timeCondition edition
    if (self.timeCondition) {
      self.timeCondition.stopEdition(true).startEdition();
    }

    // and refetch events to update ui calendar display
    $(uiCalendarConfig.calendars.eventsCalendar).fullCalendar('refetchEvents');
  };

  self.saveScheduler = function saveScheduler() {
    self.loading.save = true;

    const allPromises = {
      scheduler: self.scheduler
        .save()
        .then(() => {
          // stop edition and restart with saved value
          self.scheduler.stopEdition(false, true).startEdition();
        })
        .catch((errors) => {
          angular.forEach(errors, (error) => {
            TucToast.error(
              [
                $translate.instant('telephony_scheduler_save_error'),
                (error.data && error.data.message) || '',
              ].join(' '),
            );
          });
          return $q.reject(errors);
        }),
    };

    if (self.timeCondition) {
      allPromises.timeCondition = self.timeCondition
        .save()
        .then(() => {
          // stop edition and restart with saved value
          self.timeCondition.stopEdition(false, true).startEdition();
        })
        .catch((error) => {
          TucToast.error(
            [
              $translate.instant('telephony_scheduler_save_error'),
              get(error, 'data.message', ''),
            ].join(' '),
          );
          return $q.reject(error);
        });
    }

    return $q.all(allPromises).finally(() => {
      self.loading.save = false;
    });
  };

  /* ----------  Calendar actions  ----------*/

  self.onCalendarNavigate = function onCalendarNavigate(direction) {
    $(uiCalendarConfig.calendars.eventsCalendar).fullCalendar(direction);
  };

  self.onChangeCalendarView = function onChangeCalendarView(viewName) {
    self.model.currentView = viewName;
    $(uiCalendarConfig.calendars.eventsCalendar).fullCalendar(
      'changeView',
      viewName,
    );
  };

  self.createEvent = function createEvent(dateStart, dateEnd) {
    return new VoipSchedulerEvent({
      billingAccount: self.scheduler.billingAccount,
      serviceName: self.scheduler.serviceName,
      dateStart,
      dateEnd,
      status: 'CREATING',
    });
  };

  /* ----------  Communication between components  ----------*/

  self.onFiltersChange = function onFiltersChange() {
    $(uiCalendarConfig.calendars.eventsCalendar).fullCalendar('refetchEvents');
  };

  /* ----------  Actions menu  ----------*/

  self.manageAdd = function manageAdd() {
    if (self.model.currentView === 'month') {
      $location.hash('scheduler-calendar');
      $anchorScroll();
    }

    $(uiCalendarConfig.calendars.eventsCalendar).fullCalendar(
      'select',
      moment().startOf('day'),
      moment().endOf('day'),
    );
    self.status.displayActions = false;
  };

  self.manageImport = function manageImport() {
    const importModal = $uibModal.open({
      animation: true,
      backdrop: 'static',
      template: importTemplate,
      controller: importController,
      controllerAs: 'SchedulerImportCtrl',
      resolve: {
        modalData() {
          return {
            scheduler: self.scheduler,
          };
        },
      },
    });

    importModal.result.then(
      (importDatas) => {
        self.loading.import = true;

        startImportTaskPolling(importDatas.importTask.taskId)
          .then(
            () => {
              OvhApiTelephony.Scheduler()
                .Events()
                .v6()
                .resetAllCache();
              $(uiCalendarConfig.calendars.eventsCalendar).fullCalendar(
                'refetchEvents',
              );
              TucToast.success(
                $translate.instant('telephony_scheduler_import_success'),
              );
            },
            (error) => {
              TucToast.error(
                [
                  $translate.instant('telephony_scheduler_import_error'),
                  (error && error.message) || '',
                ].join(' '),
              );
              return $q.reject(error);
            },
          )
          .finally(() => {
            self.loading.import = false;

            // try to delete uploaded document
            if (importDatas.uploadedDocument) {
              OvhApiMe.Document()
                .v6()
                .delete({
                  id: importDatas.uploadedDocument.id,
                });
            }
          });
      },
      (error) => {
        if (error && !isString(error)) {
          TucToast.error(
            [
              $translate.instant('telephony_scheduler_import_error'),
              (error.data && error.data.message) || '',
            ].join(' '),
          );
        }
        return $q.reject(error);
      },
    );

    self.status.displayActions = false;

    return importModal;
  };

  self.manageExport = function manageExport() {
    const exportModal = $uibModal.open({
      animation: true,
      backdrop: 'static',
      template: exportTemplate,
      controller: exportController,
      controllerAs: 'SchedulerExportCtrl',
      resolve: {
        modalData() {
          return {
            scheduler: self.scheduler,
            timeCondition: self.timeCondition,
            filters: self.model.filters.categories,
          };
        },
      },
    });

    exportModal.result.catch((error) => {
      if (error && !isString(error)) {
        TucToast.error(
          [
            $translate.instant('telephony_scheduler_export_error'),
            (error.data && error.data.message) || '',
          ].join(' '),
        );
      }
      return $q.reject(error);
    });

    self.status.displayActions = false;

    return exportModal;
  };

  self.manageBankHolidays = function manageBankHolidays() {
    const bankHolidaysModal = $uibModal.open({
      animation: true,
      backdrop: 'static',
      template: bankHolidaysTemplate,
      controller: bankHolidaysController,
      controllerAs: 'SchedulerHolidaysCtrl',
      resolve: {
        modalData() {
          return {
            scheduler: self.scheduler,
          };
        },
      },
    });

    bankHolidaysModal.result.then((datas) => {
      if (datas && datas.newEvents && datas.newEvents.length) {
        datas.newEvents.forEach((event) => {
          self.scheduler.addEvent({
            title: $translate.instant(
              `telephony_scheduler_bank_holidays_${event.name}`,
            ),
            categories: 'holidays',
            status: 'TOCREATE',
            dateStart: event.date.toDate(),
            dateEnd: moment(event.date)
              .endOf('day')
              .toDate(),
          });
        });
        $(uiCalendarConfig.calendars.eventsCalendar).fullCalendar(
          'refetchEvents',
        );
      }
    });

    self.status.displayActions = false;

    return bankHolidaysModal;
  };

  self.manageDeleteAll = function manageDeleteAll() {
    self.loading.deleteAll = true;

    $uibModal
      .open({
        template: deleteAllTemplate,
        controller: deleteAllController,
        controllerAs: '$ctrl',
      })
      .result.then(() => self.scheduler.getEvents())
      .then(() => {
        // remove events to create from scheduler events list
        self.scheduler.events
          .filter(({ status }) => status === 'TO_CREATE')
          .forEach((event) => {
            self.scheduler.removeEvent(event);
          });

        self.scheduler.events.forEach((event) => {
          // eslint-disable-next-line no-param-reassign
          event.startEdition().status = 'TODELETE';
        });

        $(uiCalendarConfig.calendars.eventsCalendar).fullCalendar(
          'refetchEvents',
        );
      })
      .finally(() => {
        self.loading.deleteAll = false;
        self.status.deleteConfirm = false;
        self.status.displayActions = false;
      });
  };

  /* -----  End of ACTIONS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  /* ----------  Translations load  ----------*/

  function getTranslations() {
    self.loading.translations = true;

    $translatePartialLoader.addPart(
      '../components/telecom/telephony/scheduler',
    );
    $translatePartialLoader.addPart(
      '../components/telecom/telephony/timeCondition/slot',
    );
    return $translate.refresh().finally(() => {
      self.loading.translations = false;
    });
  }

  /* ----------  Component initialization  ----------*/

  self.$onInit = function $onInit() {
    self.loading.init = true;

    return getTranslations()
      .then(() => {
        // start scheduler edition
        self.scheduler.startEdition();

        // start timeCondition edition
        if (self.timeCondition) {
          self.timeCondition.startEdition();
        }

        // register is desktop check
        matchmedia.onDesktop((mediaQueryList) => {
          self.status.isDesktop = mediaQueryList.matches;
        });
      })
      .catch((error) => {
        TucToast.error(
          [
            $translate.instant('telephony_scheduler_load_error'),
            (error.data && error.data.message) || '',
          ].join(' '),
        );
        return $q.reject(error);
      })
      .finally(() => {
        self.loading.init = false;
      });
  };

  /* ----------  Component destroy  ----------*/

  self.$onDestroy = function $onDestroy() {
    self.scheduler.stopEdition(true);
    if (self.timeCondition) {
      self.timeCondition.stopEdition(true);
    }

    // stop task polling
    Poller.kill({
      namespace: `importIcs_${self.scheduler.serviceName}`,
    });
  };

  /* -----  End of INITIALIZATION  ------*/
}
