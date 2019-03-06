

angular.module('managerApp').service('CloudProjectBillingDetailsDisplayHelper', function () {
  let activeDayInfo = null;


  let firstDayInfo = null;


  let lastDayInfo = null;


  let hoveredDayInfo = null;

  /*= =====================================
    =            Active day dot            =
    ====================================== */

  this.setActiveDayInfo = function (info) {
    activeDayInfo = info;
  };

  this.getActiveDayInfo = function () {
    return activeDayInfo;
  };

  /*= ====================================
    =            First day dot            =
    ===================================== */

  this.setFirstDayInfo = function (info) {
    firstDayInfo = info;
  };

  this.getFirstDayInfo = function () {
    return firstDayInfo;
  };

  /*= ===================================
    =            Last day dot            =
    ==================================== */

  this.setLastDayInfo = function (info) {
    lastDayInfo = info;
  };

  this.getLastDayInfo = function () {
    return lastDayInfo;
  };

  /*= ======================================
    =            Hovered day dot            =
    ======================================= */

  this.setHoveredDayInfo = function (info) {
    hoveredDayInfo = info;
  };

  this.getHoveredDayInfo = function () {
    return hoveredDayInfo;
  };
});
