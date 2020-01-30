angular
  .module('managerApp')
  .controller(
    'DBaasTsProjectDetailsKeyCtrl.exampleUseToken',
    function DBaasTsProjectDetailsKeyCtrlExampleUseTokenCtrl(
      params,
      OvhApiMe,
      $uibModalInstance,
      DBaasTsConstants,
    ) {
      // -- Variables declaration
      const self = this;

      self.key = params.key;
      self.apiURL = params.apiURL;

      // TODO: support multiple key
      const permission = self.key.permissions[0];
      self.dbaastsApiURL = DBaasTsConstants.api[permission];

      // -- Init --

      function initGuideURL() {
        OvhApiMe.v6()
          .get()
          .$promise.then((me) => {
            const lang = me.ovhSubsidiary;
            const guide = DBaasTsConstants.guides[permission];
            if (guide) {
              self.dbaastsGuideKeyUrl = guide[lang] || guide.FR;
            }
          });
      }

      initGuideURL();

      // --

      self.close = function close() {
        $uibModalInstance.close();
      };
    },
  );
