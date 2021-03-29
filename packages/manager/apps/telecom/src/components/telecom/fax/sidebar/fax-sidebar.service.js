import sortBy from 'lodash/sortBy';

angular
  .module('managerApp')
  .service(
    'FaxSidebar',
    function FaxSidebar($translate, SidebarMenu, OvhApiFreeFax) {
      const self = this;

      self.mainSectionItem = null;

      /*= =======================================
    =            SUBITEMS LOADING            =
    ======================================== */

      self.loadFaxMainSection = function loadFaxMainSection() {
        return OvhApiFreeFax.v6()
          .query()
          .$promise.then((faxList) => {
            sortBy(faxList, 'number').forEach((fax) => {
              SidebarMenu.addMenuItem(
                {
                  title: fax,
                  prefix: $translate.instant(
                    'telecom_sidebar_fax_prefix_freefax',
                  ),
                  state: 'freefaxes.freefax',
                  stateParams: {
                    serviceName: fax,
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
          title: $translate.instant('telecom_sidebar_section_fax'),
          error: $translate.instant('telecom_sidebar_load_error'),
          category: 'freefax',
          icon: 'ovh-font ovh-font-print',
          allowSubItems: !expand,
          loadOnState: 'freefaxes',
          ...(expand
            ? { state: 'freefaxes.index' }
            : { onLoad: self.loadFaxMainSection }),
        });

        return self.mainSectionItem;
      };

      /* -----  End of INITIALIZATION  ------*/
    },
  );
