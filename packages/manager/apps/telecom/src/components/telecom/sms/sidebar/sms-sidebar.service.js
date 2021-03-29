angular
  .module('managerApp')
  .run(($rootScope, SidebarMenu) => {
    $rootScope.$on('sms_updateName', (event, serviceId, serviceName) => {
      SidebarMenu.updateItemDisplay(
        {
          title: serviceName,
        },
        serviceId,
        'telecom-sms-section',
      );
    });
  })
  .service(
    'SmsSidebar',
    function SmsSidebar($translate, SidebarMenu, TucSmsMediator) {
      const self = this;

      self.mainSectionItem = null;

      /*= =======================================
      =            SUBITEMS LOADING            =
      ======================================== */

      self.loadSmsMainSection = function loadSmsMainSection() {
        return TucSmsMediator.initAll().then((smsDetails) => {
          angular.forEach(smsDetails, (smsDetail) => {
            SidebarMenu.addMenuItem(
              {
                id: smsDetail.name,
                title: smsDetail.description || smsDetail.name,
                state: 'sms.service.dashboard',
                stateParams: {
                  serviceName: smsDetail.name,
                },
              },
              self.mainSectionItem,
            );
          });
        });
      };

      /* -----  End of SUBITEMS LOADING  ------*/

      /*= =====================================
      =            INITIALIZATION            =
      ====================================== */

      self.init = function init(expand) {
        self.mainSectionItem = SidebarMenu.addMenuItem({
          title: $translate.instant('telecom_sidebar_section_sms'),
          error: $translate.instant('telecom_sidebar_load_error'),
          id: 'telecom-sms-section',
          category: 'sms',
          icon: 'ovh-font ovh-font-message',
          allowSubItems: !expand,
          allowSearch: !expand,
          loadOnState: 'sms',
          ...(expand
            ? { state: 'sms.index' }
            : { onLoad: self.loadSmsMainSection }),
        });

        return self.mainSectionItem;
      };

      /* -----  End of INITIALIZATION  ------*/
    },
  );
