export default /* @ngInject */ function ($timeout) {
  const self = this;
  let repaintTimeout = null;

  /*= ==============================
    =            HELPERS            =
    =============================== */

  self.askForRepaint = function askForRepaint() {
    if (repaintTimeout) {
      $timeout.cancel(repaintTimeout);
    }

    repaintTimeout = $timeout(() => {
      if (self.instance) {
        self.instance.setSuspendDrawing(false, true);
      }
    }, 150);

    return repaintTimeout;
  };

  /* -----  End of HELPERS  ------*/
}
