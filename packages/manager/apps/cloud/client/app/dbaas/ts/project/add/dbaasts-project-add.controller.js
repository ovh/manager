angular
  .module('managerApp')
  .controller('DBaasTsProjectAddCtrl', function DBaasTsProjectAddCtrl(
    OvhApiMe,
    DBaasTsConstants,
  ) {
    const self = this;

    OvhApiMe.v6()
      .get()
      .$promise.then((me) => {
        const lang = me.ovhSubsidiary;
        const { order } = DBaasTsConstants.urls;

        self.orderUrl = order[lang] || order.FR;
      });
  });
