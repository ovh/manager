angular.module('App').controller(
  'ZonesTabsCtrl',
  class ZonesTabsCtrl {
    /**
     * Constructor
     * @param $scope
     * @param $location
     * @param $stateParams
     * @param Domain
     * @param WucEmails
     */
    constructor($scope, $location, $stateParams, $translate, atInternet, Domain, WucEmails) {
      this.$scope = $scope;
      this.$location = $location;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.atInternet = atInternet;
      this.Domain = Domain;
      this.WucEmails = WucEmails;
    }

    $onInit() {
      this.defaultTab = 'ZONE';
      this.tabs = ['ZONE', 'REDIRECTION', 'DYNHOST', 'TASKS'];
      this.tabMenu = {
        title: this.$translate.instant('navigation_more'),
        items: [
          {
            label: this.$translate.instant('domain_tab_menu_emails'),
            target: `#/configuration/email-domain/${
              this.$stateParams.productId
            }?tab=MAILING_LIST`,
            type: 'LINK',
          },
          {
            label: this.$translate.instant('contacts_management'),
            target: `#/useraccount/contacts?tab=SERVICES&serviceName=${
              this.$stateParams.productId
            }`,
            text: this.$translate.instant('domain_tab_menu_contacts'),
            type: 'LINK',
          },
        ],
      };

      this.setSelectedTab = (tab) => {
        if (_.indexOf(this.tabs, tab) !== -1) {
          this.selectedTab = tab;
        } else {
          this.selectedTab = this.defaultTab;
        }

        this.atInternet.trackClick({
          name: `web::domain::product-${this.selectedTab}`,
          type: 'action',
        });

        this.$location.search('tab', this.selectedTab);
      };

      this.WucEmails.getDomains().then((emails) => {
        if (_.indexOf(emails, this.$stateParams.productId) === -1) {
          this.tabMenu.items = _.drop(this.tabMenu.items);
        }
      });

      this.setSelectedTab(angular.uppercase(this.$stateParams.tab));
    }

    /**
     * Convert string to KebabCase
     * @param {string} str
     */
    static toKebabCase(str) {
      return _.kebabCase(str);
    }
  },
);
