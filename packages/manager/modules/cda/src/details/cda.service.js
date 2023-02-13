export default class CdaService {
  /* @ngInject */
  constructor($injector, $q, $translate, OvhApiDedicatedCeph, CucCloudMessage) {
    const self = this;

    self.currentService = {};

    self.initDetails = function initDetails(serviceName, forceRefresh) {
      if (!serviceName) {
        self.currentService = {};
        return $q.reject();
      }

      if (
        self.currentService.serviceName !== serviceName ||
        forceRefresh === true
      ) {
        OvhApiDedicatedCeph.v6().resetQueryCache();
        return OvhApiDedicatedCeph.v6()
          .get({
            serviceName,
          })
          .$promise.then((cda) => {
            self.currentService = cda;
            return cda;
          })
          .catch((error) => {
            CucCloudMessage.error(
              [
                $translate.instant('ceph_common_error'),
                (error.data && error.data.message) || '',
              ].join(' '),
            );
          });
      }
      return $q.when(self.currentService);
    };

    self.updateDetails = function updateDetails(
      serviceName,
      label,
      crushTunable,
    ) {
      self.saving = true;
      return OvhApiDedicatedCeph.v6()
        .put(
          {
            serviceName,
          },
          {
            serviceName,
            crushTunables: crushTunable,
            label,
          },
        )
        .$promise.then(() => {
          self.initDetails(serviceName, true).then(() => {
            self.changeMenuTitle(
              serviceName,
              self.currentService.label
                ? self.currentService.label
                : self.currentService.serviceName,
            );
          });
        })
        .catch((error) => $q.reject(error));
    };

    self.changeMenuTitle = function changeMenuTitle(serviceName, label) {
      if ($injector.has('shellClient')) {
        const shellClient = $injector.get('shellClient');
        shellClient.ux.updateMenuSidebarItemLabel(serviceName, label);
      }
    };

    self.getUsers = function getUsers(params) {
      OvhApiDedicatedCeph.User()
        .Aapi()
        .resetCache();

      return OvhApiDedicatedCeph.User()
        .Aapi()
        .users({
          serviceName: params.serviceName,
        })
        .$promise.then((users) => users);
    };
  }
}
