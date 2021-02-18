angular
  .module('managerApp')
  .service('deskaasSidebar', function deskaasSidebar(
    $rootScope,
    OvhApiDeskaasService,
    $q,
    SidebarMenu,
  ) {
    const self = this;

    /*= ===================================
      =            SECTION LOAD            =
      ==================================== */

    /* ----------  API CALL  ----------*/

    self.getServices = function getServices() {
      return $q((resolve) => {
        OvhApiDeskaasService.v6()
          .query()
          .$promise.then((serviceNames) => {
            const requests = [];

            angular.forEach(serviceNames, (serviceName) => {
              requests.push(
                OvhApiDeskaasService.v6()
                  .get({ serviceName })
                  .$promise.then(
                    (service) => service,
                    () => ({ serviceName, alias: '', error: true }),
                  ),
              );
            });

            $q.all(requests).then((elements) => {
              resolve(elements);
            });
          })
          .catch(() => {
            resolve();
          });
      });
    };

    self.getEntryMenu = function getEntryMenu(service) {
      const id = `deskaas_${service.serviceName}`;
      const title =
        service.alias === 'noAlias' || service.alias === ''
          ? service.serviceName
          : `${service.alias} (${service.serviceName})`;
      return { id, title };
    };

    /* */
    self.updateItem = function updateItem(service) {
      const entry = self.getEntryMenu(service);
      if (self.section) {
        SidebarMenu.updateItemDisplay(
          {
            title: entry.title,
          },
          entry.id,
          self.section.id,
        );
      }
    };

    /* ----------  FILL  ----------*/

    self.loadIntoSection = function loadIntoSection(section, servicesParams) {
      let services = servicesParams;
      self.section = section;
      services = services.sort();
      // For each project, add an item
      angular.forEach(services, (service) => {
        if (!service.error) {
          const entry = self.getEntryMenu(service);
          SidebarMenu.addMenuItem(
            {
              id: entry.id,
              title: entry.title,
              // icon: "dedicated-cloud2",
              state: 'deskaas.details',
              stateParams: {
                serviceName: service.serviceName,
              },
            },
            section,
          );
        }
      });
    };

    /* -----  End of SECTION LOAD  ------*/
  });
