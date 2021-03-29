import forEach from 'lodash/forEach';
import map from 'lodash/map';

angular
  .module('managerApp')
  .run(($rootScope, SidebarMenu) => {
    $rootScope.$on('overTheBox_updateName', (event, serviceId, serviceName) => {
      SidebarMenu.updateItemDisplay(
        {
          title: serviceName,
        },
        serviceId,
        'telecom-otb-section',
      );
    });
  })
  .service(
    'OverTheBoxSidebar',
    function OverTheBoxSidebar($q, $translate, SidebarMenu, OvhApiOverTheBox) {
      const self = this;

      self.mainSectionItem = null;

      /*= =======================================
      =            SUBITEMS LOADING            =
      ======================================== */

      self.loadOtbMainSection = function loadOtbMainSection() {
        let requests = [];

        return OvhApiOverTheBox.v6()
          .query()
          .$promise.then((serviceNames) => {
            requests = map(
              serviceNames,
              (serviceName) =>
                OvhApiOverTheBox.v6().get({
                  serviceName,
                }).$promise,
            );

            return $q.all(requests).then((overTheBoxDetails) => {
              forEach(overTheBoxDetails, (overTheBoxDetail) => {
                SidebarMenu.addMenuItem(
                  {
                    title:
                      overTheBoxDetail.customerDescription ||
                      overTheBoxDetail.serviceName,
                    id: overTheBoxDetail.serviceName,
                    state: 'overTheBoxes.overTheBox.details',
                    stateParams: {
                      serviceName: overTheBoxDetail.serviceName,
                    },
                  },
                  self.mainSectionItem,
                );
              });
            });
          });
      };

      /* -----  End of SUBITEMS LOADING  ------*/

      /*= =====================================
      =            INITIALIZATION            =
      ====================================== */

      self.init = function init(expand) {
        self.mainSectionItem = SidebarMenu.addMenuItem({
          title: $translate.instant('telecom_sidebar_section_otb'),
          error: $translate.instant('telecom_sidebar_load_error'),
          id: 'telecom-otb-section',
          category: 'overTheBox',
          icon: 'ovh-font ovh-font-overTheBox',
          allowSubItems: !expand,
          loadOnState: 'overTheBoxes',
          allowSearch: !expand,
          infiniteScroll: true,
          ...(expand
            ? { state: 'overTheBoxes.index' }
            : { onLoad: self.loadOtbMainSection }),
        });

        return self.mainSectionItem;
      };

      /* -----  End of INITIALIZATION  ------*/
    },
  );
