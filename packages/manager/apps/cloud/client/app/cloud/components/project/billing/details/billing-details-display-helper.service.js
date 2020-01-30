angular
  .module('managerApp')
  .service(
    'CloudProjectBillingDetailsDisplayHelper',
    function CloudProjectBillingDetailsDisplayHelper() {
      let activeDayInfo = null;

      let firstDayInfo = null;

      let lastDayInfo = null;

      let hoveredDayInfo = null;

      /*= =====================================
    =            Active day dot            =
    ====================================== */

      this.setActiveDayInfo = function setActiveDayInfo(info) {
        activeDayInfo = info;
      };

      this.getActiveDayInfo = function getActiveDayInfo() {
        return activeDayInfo;
      };

      /*= ====================================
    =            First day dot            =
    ===================================== */

      this.setFirstDayInfo = function setFirstDayInfo(info) {
        firstDayInfo = info;
      };

      this.getFirstDayInfo = function getFirstDayInfo() {
        return firstDayInfo;
      };

      /*= ===================================
    =            Last day dot            =
    ==================================== */

      this.setLastDayInfo = function setLastDayInfo(info) {
        lastDayInfo = info;
      };

      this.getLastDayInfo = function getLastDayInfo() {
        return lastDayInfo;
      };

      /*= ======================================
    =            Hovered day dot            =
    ======================================= */

      this.setHoveredDayInfo = function setHoveredDayInfo(info) {
        hoveredDayInfo = info;
      };

      this.getHoveredDayInfo = function getHoveredDayInfo() {
        return hoveredDayInfo;
      };
    },
  );
